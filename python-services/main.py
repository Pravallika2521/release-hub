from fastapi import FastAPI
from readiness_engine import calculate_readiness

app = FastAPI()

@app.get("/readiness")
def get_readiness():
    return calculate_readiness()
``
