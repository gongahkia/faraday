from typing import List
import re

class TextSplitterConfigError(Exception):
    pass

class RecursiveCharacterTextSplitter:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self._validate_params(chunk_size, chunk_overlap)
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators = ["\n\n", "\n", " ", ""]

    def split_text(self, text: str) -> List[str]:
        """E-Ink optimized text splitting with overlap management"""
        return self._recursive_split(
            text.strip(),
            self.separators,
            self.chunk_size,
            self.chunk_overlap
        )

    def _recursive_split(self, text: str, separators: List[str], chunk_size: int, chunk_overlap: int) -> List[str]:
        for sep in separators:
            if sep == "":
                return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size - chunk_overlap)]
            
            splits = text.split(sep)
            combined = self._combine_splits(splits, sep, chunk_size, chunk_overlap)
            
            if len(combined) > 1:
                return combined
        
        return [text]

    def _combine_splits(self, splits: List[str], separator: str, chunk_size: int, chunk_overlap: int) -> List[str]:
        chunks = []
        current_chunk = []
        total_length = 0

        for split in splits:
            split_length = len(split) + len(separator)
            if total_length + split_length > chunk_size:
                if current_chunk:
                    chunks.append(separator.join(current_chunk))
                    current_chunk = current_chunk[-chunk_overlap:] if chunk_overlap else []
                    total_length = sum(len(s) for s in current_chunk) + len(separator)*len(current_chunk)
            current_chunk.append(split)
            total_length += split_length

        if current_chunk:
            chunks.append(separator.join(current_chunk))
            
        return chunks

    def _validate_params(self, chunk_size: int, chunk_overlap: int):
        if chunk_overlap >= chunk_size:
            raise TextSplitterConfigError("Chunk overlap must be smaller than chunk size")