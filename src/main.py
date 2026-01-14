from fastapi import FastAPI
import uvicorn

# 1. Create the App
app = FastAPI(
    title="XAI Health Risk System",
    description="API for predicting health risks with explanations",
    version="1.0.0"
)

# 2. Define a simple root route (Sanity check)
@app.get("/")
def read_root():
    return {"message": "Health Risk System API is running"}

# 3. This allows you to run the file directly logic
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)