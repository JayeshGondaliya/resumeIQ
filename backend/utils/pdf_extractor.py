import fitz
import re


class ScannedPDFError(Exception):
    pass


def extract_text_from_pdf(pdf_path: str) -> str:
    doc = fitz.open(pdf_path)
    text_chunks = []

    for page in doc:
        text = page.get_text("text")

        if not text or len(text.strip()) < 20:
            blocks = page.get_text("blocks")
            for block in blocks:
                if isinstance(block, (list, tuple)) and len(block) > 4:
                    block_text = block[4].strip()
                    if block_text:
                        text_chunks.append(block_text)
        else:
            text_chunks.append(text)

    extracted_text = "\n".join(text_chunks).strip()

    if is_scanned_pdf(extracted_text):
        raise ScannedPDFError(
            "Scanned or image-based PDF detected. Please upload a text-based resume."
        )

    return extracted_text


def is_scanned_pdf(text: str) -> bool:
    if not text:
        return True

    total_chars = len(text)
    alpha_chars = len(re.findall(r"[A-Za-z]", text))
    words = re.findall(r"\b\w+\b", text)

    if total_chars < 100:
        return True

    if len(words) < 25:
        return True

    if alpha_chars / total_chars < 0.20:
        return True

    return False
