from utils.pdf_extractor import extract_text_from_pdf, ScannedPDFError
from utils.gemini_client import extract_resume_json_with_gemini, GeminiError
from utils.job_parser import extract_job_json_with_gemini, GeminiError
from utils.ats_score import calculate_ats_score


def main():
    pdf_path = "Harsh_shahporia.pdf"

    try:
        print("\nExtracting text from PDF...")
        raw_text = extract_text_from_pdf(pdf_path)

        print(f"Extracted {len(raw_text)} characters")

        print("\nSending text to Gemini for cleaning...")
        cleaned_text = extract_resume_json_with_gemini(raw_text)

        job_json = extract_job_json_with_gemini("Flutter Developer")

        ats_score = calculate_ats_score(cleaned_text, job_json)

        print("\n✅ CLEANED RESUME TEXT\n")
        print("-" * 60)
        print(cleaned_text)
        print("-" * 60)

        print("\n✅ JOB JSON\n")
        print("-" * 60)
        print(job_json)
        print("-" * 60)

        print("\n✅ ATS SCORE\n")
        print("-" * 60)
        print(ats_score)
        print("-" * 60)

    except ScannedPDFError as e:
        print("❌ Scanned PDF Error:", e)

    except GeminiError as e:
        print("❌ Gemini Error:", e)

    except Exception as e:
        print("⚠️ Unexpected Error:", e)


if __name__ == "__main__":
    main()
