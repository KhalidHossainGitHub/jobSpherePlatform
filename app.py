
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as gemini
import PyPDF2
from io import BytesIO
import logging
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.DEBUG)
gemini.configure(api_key=os.getenv('GEMINI'))

def extract_text_from_pdf(file):
    pdf_reader = PyPDF2.PdfReader(file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def generate_pdf_from_text(text):
    from fpdf import FPDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, text)
    pdf_output = BytesIO()
    pdf.output(pdf_output)
    pdf_output.seek(0)
    return pdf_output

@app.route("/analyze-resume", methods=["POST"])
def analyze_resume():
    if "resume" not in request.files:
        logging.error("No resume file uploaded.")
        return jsonify({"error": "No resume file uploaded."}), 400

    resume_file = request.files["resume"]
    question = request.form.get("question")

    if not question:
        logging.error("No question provided.")
        return jsonify({"error": "No question provided."}), 400

    try:
        if not resume_file.filename.endswith(".pdf"):
            logging.error("Unsupported file format. Please upload a PDF file.")
            return jsonify({"error": "Unsupported file format. Please upload a PDF file."}), 400

        resume_text = extract_text_from_pdf(resume_file.stream)
        logging.debug(f"Extracted resume text: {resume_text[:500]}...")

        response = gemini.generate_text(
            prompt=f"Analyze the following resume:\n{resume_text}\n\nQuestion: {question}",
            temperature=0.7,
        )

        if not response or not hasattr(response, "result"):
            logging.error("Failed to generate response from Gemini.")
            return jsonify({"error": "Error processing the resume with Gemini API."}), 500

        answer = response.result or "No specific answer provided."
        suggestions = "Consider emphasizing key achievements, skills, and tailoring the resume for the intended role."
        logging.debug(f"Generated answer: {answer}")
        logging.debug(f"Suggestions: {suggestions}")

        new_resume_text = f"{resume_text}\n\nAnalysis:\n{answer}\n\nSuggestions:\n{suggestions}"
        new_resume_pdf = generate_pdf_from_text(new_resume_text)

        return (
            jsonify({"message": "Resume analyzed successfully!"}),
            200,
            {
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=analyzed_resume.pdf",
            },
        )

    except Exception as e:
        logging.exception("An error occurred while processing the resume.")
        return jsonify({"error": "An error occurred while processing the resume."}), 500

if __name__ == "__main__":
    app.run(debug=True)

