# Gemini listens to user input and responds accordingly
# Author: Tianyu Yang
# Two modes planned: text input and voice input

# Current status:
# 1. Text input mode is implemented
# 2. Voice input mode is not implemented yet

import google.generativeai as genai
# import speech_recognition as sr # for voice input
import os # for reading api key

def initialize_gemini(api_key_file):
    try:
        print(f"Reading API key from: {api_key_file}")  # Debug statement
        with open(api_key_file, 'r') as file:
            api_key = file.read().strip() # read api key from file, strip removes whitespace if any
        print(f"API Key read: {api_key}")  # Debug statement
        genai.configure(api_key=api_key)
        print("Google Gemini API initialized successfully.")
    except FileNotFoundError:
        print(f"Error: {api_key_file} not found. Please create the file and add your API key or check the path.")
        exit(99)
    except Exception as e:
        print(f"Error initializing Gemini API: {e}")
        exit(1) # exit the program, return 1 to indicate error, 0 for success (any non-zero value indicates error)

def main():
    api_key_file_path = "/home/pi/Projects/Gemini_API/api_key.txt"
    initialize_gemini(api_key_file_path)
    model = genai.GenerativeModel("gemini-1.5-flash-8b")
    while True:
        user_input = input("You: (enter 'exit' to quit) ")
        if user_input.lower() == "exit":
            break
        response = model.generate_content(user_input)
        print(f"Gemini: {response.text}")

if __name__ == "__main__":
    main()