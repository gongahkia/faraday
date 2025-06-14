[![](https://img.shields.io/badge/faraday_1.0.0-passing-green)](https://github.com/gongahkia/faraday/releases/tag/1.0.0) 

# `Faraday` ⚡️

Full Stack AI Chat solution for your [Onyx Boox](https://www.boox.com/) devices.

`Faraday` provides both a Frontend on your [Onyx E-Ink Device](#frontend) and a [Local AI](#model) [Backend](#backend), optimized for [battery life and document processing](#other-notes).

## Stack

* *Frontend*: [React Native](https://reactnative.dev/), [Generic Onyx Boox SDK](https://github.com/stevezuo/booxsdk)
* *Backend*: [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/), [Python](www.python.org)
* *Package*: [Docker](https://www.docker.com/)
* *SDK*: [Onyx Boox Android SDK](https://github.com/onyx-intl/OnyxAndroidDemo)
* *Auth*: [JWT](https://jwt.io/introduction)
* *Protocol*: [HTTP/2](https://en.wikipedia.org/wiki/HTTP/2), [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
* *Model*: [Mistral-7B-Instruct-v0.2](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2), [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
* *VectorDB*: [FAISS](https://github.com/facebookresearch/faiss)
* *Testing*: [Jest](https://jestjs.io/), [React Native Testing Library](https://reactnative.dev/docs/testing-overview), [Pytest](https://docs.pytest.org/en/stable/)

## Usage

The below instructions are for locally hosting `Faraday`.

1. Execute the following to run the [Frontend](./frontend/) and [Backend](./backend/) installation.

```console
$ git clone https://github.com/gongahkia/faraday && cd faraday
$ docker-compose -f docker/compose.prod.yml up --build
```

2. Execute the below to run [Software](./tests/document_processing/) and [Hardware](./tests/eink_ui/) tests.

```console
$ npm test -- tests/document_processing --watchAll
$ npm test -- tests/eink_ui --watchAll
```

## Architecture

Note that while `Faraday`'s Hardware Targets are any [Onyx E-Ink devices](https://onyxboox.com/product), performance was only **physically tested** on the [Onyx Boox Tab Ultra C Pro](https://www.onyxboox.sg/products/onyx-boox-tab-ultra-c-pro). It's technical specifications can be found [here](#hardware-specification).

### Overview

```mermaid
sequenceDiagram
    Actor User as User
    participant F as Frontend (E-Ink)
    participant B as Backend API
    participant D as Document Processing
    participant A as AI Services
    participant M as Models

    U->>+F: Upload PDF via Uploader.js
    F->>+B: POST /documents/upload
    B->>+D: Process Document
    D->>D: pdf_parser.extract_text()
    D->>D: text_splitter.chunk_text()
    D->>+A: vector_db.add_documents()
    A-->>-D: Embeddings Generated
    D-->>-B: Processing Complete
    B-->>-F: Upload Success
    F->>F: EpdController.partialRefresh()
    
    U->>+F: Enter Chat Query via InputHandler.js
    F->>+B: POST /chat (Streaming)
    B->>+A: vector_db.search()
    A-->>-B: Relevant Context
    B->>+M: local_llm.generate()
    M-->>-B: Stream Response Chunks
    loop For Each Chunk
        B->>F: Send Chunk
        F->>F: Update ChatHistory.js
        F->>F: EpdController.queuePartialRefresh()
    end
    F-->>-U: Display Full Response

    Note right of F: E-Ink Optimizations<br/>- Batch UI Updates<br/>- Partial Refresh Scheduling<br/>- Grayscale Image Dithering
    Note left of M: Model Management<br/>- GGUF Quantization<br/>- CPU-only Execution<br/>- 4-bit Weights
```

### [Frontend](./frontend/)

```mermaid
graph TD
    subgraph Frontend Architecture
        A[App] --> B[ChatScreen]
        A --> C[DocumentScreen]
        A --> D[EinkOptimizations]
        
        B --> B1[ChatHistory.js]
        B --> B2[InputHandler.js]
        
        C --> C1[Uploader.js]
        C --> C2[Viewer.js]
        
        D --> D1[EpdController.js]
        D1 --> D1a[Partial Refresh]
        D1 --> D1b[Full Refresh]
        D --> D2[EinkText.js]
        D2 --> D2a[Font Optimization]
        D2 --> D2b[Dithering]
        D --> D3[EinkButton.js]
        D3 --> D3a[Touch Debouncing]
        D --> D4[DitherImage.js]
        D4 --> D4a[Grayscale Conversion]
        D4 --> D4b[Floyd-Steinberg Dithering]
        D --> D5[PenTouchHelper.js]
        D5 --> D5a[Pressure Sensitivity]
        D --> D6[PartialRefreshView.js]
        D6 --> D6a[Batch Updates]
        
        B1 -.-> D1
        B2 -.-> D5
        C2 -.-> D4
        C1 -.-> D3
        
        style D fill:#e0f2fe,stroke:#38bdf8
    end
    
    subgraph BackendServices
        E[API Service]
        F[Document Processing]
        G[AI Inference]
    end
    
    B -->|HTTP| E
    C -->|HTTP| F
    A -->|WebSocket| G
```

### [Backend](./backend/)

```mermaid
graph TD
    subgraph Backend Architecture
        A[FastAPI] --> B[API Layer]
        B --> C[Document Processing Pipeline]
        B --> D[AI Inference Pipeline]
        
        subgraph API Layer
            B1[chat.py] --> B1a[Streaming Responses]
            B1 --> B1b[Context Handling]
            B2[documents.py] --> B2a[File Uploads]
            B2 --> B2b[Chunk Management]
        end

        subgraph Document Processing Pipeline
            C1[pdf_parser.py] --> C1a[PDF Text Extraction]
            C1 --> C1b[Page Validation]
            C2[text_splitter.py] --> C2a[Recursive Splitting]
            C2 --> C2b[Overlap Management]
            C3[embeddings.py] --> C3a[Sentence Transformers]
            C3 --> C3b[CPU Optimization]
        end

        subgraph AI Core Services
            D1[local_llm.py] --> D1a[GGUF Model Loading]
            D1 --> D1b[4-bit Quantization]
            D1 --> D1c[Partial Output Streaming]
            D2[vector_db.py] --> D2a[FAISS Indexing]
            D2 --> D2b[Metadata Storage]
        end

        subgraph Models
            E1[Embedding Models]
            E2[Language Models]
        end

        C1 --> C2 --> C3 --> D2
        B1 --> D1
        B2 --> C1
        D1 --> E2
        C3 --> E1
        
        style D1 fill:#f0fdf4,stroke:#4ade80
        style C3 fill:#f0fdf4,stroke:#4ade80
        style D2 fill:#f0fdf4,stroke:#4ade80
    end

    subgraph EInk Optimizations
        F[CPU-only Execution]
        G[Memory Budgeting]
        H[Partial Model Loading]
        I[Quantized Weights]
    end

    D1 --> F
    D1 --> G
    D1 --> H
    D1 --> I
```

### [Model](./models/)

```mermaid
graph TD
    subgraph Model Architecture
        A[Model Management] --> B[Embedding Models]
        A --> C[Language Models]
        
        subgraph B[Embedding Models]
            B1(config.json) --> B2(download_models.sh)
            B2 --> B3(embedding_model.py)
            B3 --> B4[all-MiniLM-L6-v2]
            B4 --> B5[CPU Optimized]
        end

        subgraph C[Language Models]
            C1(config.json) --> C2(download_models.sh)
            C2 --> C3(model_loader.py)
            C3 --> C4[GGUF Format]
            C4 --> C5[4-bit Quantized]
            C3 --> C6(quantize_model.py)
            C6 --> C7[Model Optimization]
        end
    end

    subgraph Testing Architecture
        D[Test Suites] --> E[Document Processing]
        D --> F[E-Ink UI]
        
        subgraph E[Document Processing]
            E1(conftest.py) --> E2[Fixture Management]
            E3(test_embeddings.py) --> E4[Vector Similarity]
            E5(test_pdf_parser.py) --> E6[PDF Extraction]
            E6 --> E7[Page Validation]
            E8(test_text_splitter.py) --> E9[Chunk Size]
        end

        subgraph F[E-Ink UI]
            F1(DitherImage.test.js) --> F2[Image Rendering]
            F3(EinkButton.test.js) --> F4[Touch Events]
            F5(EinkText.test.js) --> F6[Font Rendering]
            F7(EpdController.test.js) --> F8[Refresh Modes]
            F9(PenTouchHelper.test.js) --> F10[Pressure Sensitivity]
            F11(jest.config.js) --> F12[Test Framework]
        end

        style F fill:#fef2f2,stroke:#f87171
    end

    B3 --> E3
    C3 --> E3
    E5 --> E6
    E8 --> E9
    F2 --> F8
    F4 --> F10
    F6 --> F8

    subgraph EInk Optimizations
        G[Partial Refresh Testing]
        H[Pen Input Simulation]
        I[Memory Constraint Validation]
    end

    F8 --> G
    F10 --> H
    E4 --> I
    C7 --> I
```

## Reference

The name `Faraday` is in reference to [Faraday](https://cyberpunk.fandom.com/wiki/Faraday), a [fixer](https://cyberpunk.fandom.com/wiki/Fixer) turned main antagonist to [David Martinez](https://cyberpunk.fandom.com/wiki/David_Martinez) and [Maine](https://cyberpunk.fandom.com/wiki/Maine_(Edgerunners))'s crew in the anime [Cyberpunk: Edgerunners](https://cyberpunk.fandom.com/wiki/Cyberpunk:_Edgerunners).

<div align="center">
    <img src="./asset/logo/faraday.jpeg" width="75%">
</div>

## Other notes

I learnt quite a bit about developing for Hardware with less mature *(or unoptimised)* SDKs while working on `Faraday`. Below are some of my key takeaways.

1. It's necessary to implement both Partial (REGAL) and Full (GC) refresh strategies to optimize display updates on E-Ink screens.
2. 16-level grayscale with Floyd-Steinberg dithering can effectively preserve image quality while minimizing refresh artifacts.
3. A good margin for pen pressure detection is that within the 0.3–1.0N sensitivity range to improves user interaction and accuracy.
4. Targeting a battery consumption of less than 8% per hour is crucial for long-lasting E-Ink device usage.
5. Given E-Ink screen's lower refresh rates, static layout pre-rendering minimizes unnecessary reloading for optimal performance.

### Hardware Specification

* *Device*: [Onyx Boox Tab Ultra C Pro](https://www.onyxboox.sg/products/onyx-boox-tab-ultra-c-pro)
* *RAM*: 6GB (optimal execution), <5GB (peak usage constraint)
* *CPU*: Qualcomm Snapdragon 8-core (ARMv8)  
* *Display*: 10.3" Carta 1250 (1404x1872)
* *Storage*: 50MB/document size limit
* *Network*: 3G fallback optimization
* *Latency*: <2s cold starts, <500ms warm responses