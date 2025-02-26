from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

class TranslationService:
    def __init__(self, api_key):
        self.api_key = api_key
        self.llm = ChatGroq(temperature=0, groq_api_key=self.api_key, model_name="llama3-8b-8192")

    def translate_text(self, text, target_language):
        # Define the system prompt for translation
        system_prompt = f"You are a helpful assistant that translates text from English to {target_language}."
        
        # Define the chat prompt template
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", "{text}")
        ])
        
        # Create the LLM chain
        chain = LLMChain(llm=self.llm, prompt=prompt_template)
        
        # Run the chain with the input text
        translated_text = chain.run(text=text)
        
        return translated_text