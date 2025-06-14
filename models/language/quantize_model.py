from llama_cpp import Llama
import argparse

def quantize_model(input_path: str, output_path: str, q_type: str = "Q4_K_M"):
    llm = Llama(input_path)
    llm.quantize(
        output_path=output_path,
        q_type=q_type,
        threads=4,
        allow_requantize=False
    )

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=str, required=True)
    parser.add_argument("--output", type=str, required=True)
    parser.add_argument("--quant-type", type=str, default="Q4_K_M")
    args = parser.parse_args()
    
    quantize_model(args.input, args.output, args.quant_type)