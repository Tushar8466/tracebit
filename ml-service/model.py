from pydantic import BaseModel
import random

class CodeInput(BaseModel):
    code: str
    language: str

class MLModel:
    def __init__(self):
        print("Initializing Mock CodeBERT Model...")
        # In a real scenario, we would load HuggingFace transformers here
        # self.tokenizer = AutoTokenizer.from_pretrained("microsoft/codebert-base")
        # self.model = AutoModelForSequenceClassification.from_pretrained("microsoft/codebert-base")

    def predict(self, input_data: CodeInput) -> dict:
        """
        Mock prediction logic.
        Analyzes the code and returns a confidence score indicating AI-likelihood.
        """
        code = input_data.code
        
        # Simple mock heuristics
        if "Here is" in code or "Certainly" in code:
            confidence = 0.95
            label = "AI"
        elif len(code.split()) < 10:
            confidence = 0.3
            label = "Human"
        else:
            confidence = round(random.uniform(0.4, 0.9), 2)
            label = "AI" if confidence > 0.7 else "Human"
            
        return {
            "label": label,
            "confidence": confidence
        }
