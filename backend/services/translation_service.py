from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

class TranslationService:
    def __init__(self, api_key):
        self.api_key = api_key
        self.llm = ChatGroq(temperature=0, groq_api_key=self.api_key, model_name="llama3-8b-8192")

    def translate_text(self, text, target_languages):
        translations = []
        
        for language in target_languages:
            # Define the system prompt for direct translation
            system_prompt = (
                f"You are a professional translation assistant. "
                f"Your task is to translate the following text **directly** from English to {language}. "
                f"Do not add any extra words, explanations, or conversational elements. "
                f"Just provide the translated text and nothing else."
            )
            
            # Define the chat prompt template
            prompt_template = ChatPromptTemplate.from_messages([
                ("system", system_prompt),
                ("user", "{text}")
            ])
            
            # Create the LLM chain
            chain = LLMChain(llm=self.llm, prompt=prompt_template)
            
            # Run the chain with the input text
            translated_text = chain.run(text=text)
            translations.append(translated_text)
        
        return translations