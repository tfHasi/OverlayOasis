from flask import Blueprint, request, jsonify
from services.translation_service import TranslationService
import os

translation_bp = Blueprint('translation', __name__)

translation_service = TranslationService(api_key=os.getenv('GROQ_API_KEY'))

@translation_bp.route('/translation', methods=['POST'])
def translate():
    # Get the JSON data from the request
    data = request.get_json()
    
    # Extract the text and target language from the request
    text = data.get('text')
    target_language = data.get('target_language')
    
    if not text or not target_language:
        return jsonify({"error": "Both 'text' and 'target_language' are required"}), 400
    
    # Translate the text
    translated_text = translation_service.translate_text(text, target_language)
    
    # Return the translated text as a JSON response
    return jsonify({"translated_text": translated_text})