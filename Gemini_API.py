import google.generativeai as genai

# API key is available at https://aistudio.google.com/app/apikey or https://console.cloud.google.com/apis/credentials
genai.configure(api_key="user-api-key")
model = genai.GenerativeModel("gemini-1.5-flash-8b")
response = model.generate_content("Explain who you are")
print(response.text)