from flask import Blueprint, request, jsonify
from services.translation_service import TranslationService
import os

# Create a Blueprint for the translation service
translation_bp = Blueprint('translation', __name__)

# Initialize the TranslationService with the Groq API key
translation_service = TranslationService(api_key=os.getenv('GROQ_API_KEY'))

@translation_bp.route('/translation', methods=['POST'])
def translate():
    # Get the JSON data from the request
    data = request.get_json()
    
    # Extract the text and target languages from the request
    text = data.get('text')
    target_languages = data.get('target_languages')
    
    # Validate inputs
    if not text or not isinstance(text, str):
        return jsonify({"error": "'text' must be a non-empty string"}), 400
    if not target_languages or not isinstance(target_languages, list):
        return jsonify({"error": "'target_languages' must be a non-empty array"}), 400
    
    # Translate the text into multiple languages
    try:
        translated_texts = translation_service.translate_text(text, target_languages)
        return jsonify({"translations": translated_texts})
    except Exception as e:
        return jsonify({"error": f"Translation failed: {str(e)}"}), 500