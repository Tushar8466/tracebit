from fastapi import FastAPI
from model import MLModel, CodeInput
import uvicorn

app = FastAPI(title="TraceBit ML Service")
model = MLModel()

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ml-service"}

@app.post("/classify")
def classify_code(input_data: CodeInput):
    """
    Endpoint to receive code diffs and return an AI-likelihood classification.
    """
    result = model.predict(input_data)
    return result

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
