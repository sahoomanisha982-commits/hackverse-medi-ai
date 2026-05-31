import os
# Flask imports
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# Allow cross-origin requests from frontend deployment & localhost
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY is not set!")
genai.configure(api_key=GEMINI_API_KEY)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "MediAI Backend running smoothly"}), 200

@app.route('/api/analyze-symptoms', methods=['POST'])
def analyze_symptoms():
    try:
        data = request.json
        symptoms = data.get('symptoms', '')
        age = data.get('age', 'Unknown')
        gender = data.get('gender', 'Unknown')

        if not symptoms:
            return jsonify({"error": "Symptoms are required"}), 400

        # Constructing a structured prompt to enforce a reliable JSON response layout
        prompt = f"""
        You are an advanced medical AI assistant. Analyze the following patient data:
        Age: {age}, Gender: {gender}
        Symptoms: {symptoms}

        Provide a structured assessment containing:
        1. Potential conditions (clearly stating this is NOT an official diagnosis).
        2. Severity Level (Low, Medium, Critical).
        3. Recommended Next Steps (e.g., see a GP, rest, drink fluids, go to ER).
        4. Preventive self-care tips.
        
        Keep your advice empathetic, professional, clear, and highly structured using bullet points.
        Include a prominent disclaimer that this is an AI tool and the patient must consult a doctor.
        """

        model = genai.GenerativeModel('gemini-flash-latest')
        response = model.generate_content(prompt)
        
        return jsonify({
            "success": True,
            "analysis": response.text
        }), 200

    except Exception as e:
        print("🚨 ACTUAL API CRASH ERROR:", str(e)) 
        return jsonify({"success": False, "error": str(e)}), 500
    
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)