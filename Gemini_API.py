# API key is available at https://aistudio.google.com/app/apikey or https://console.cloud.google.com/apis/credentials
from google import genai
from pathlib import Path

# Read API key from API.txt file
api_key = Path("API.txt").read_text().strip()
client = genai.Client(api_key=api_key)

response = client.models.generate_content(
    model="gemini-2.5-flash", 
    contents="Explain how AI works in a few words"
)
print(response.text)