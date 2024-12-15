# Gemini listens to user input and responds accordingly
# Author: Tianyu Yang
# Two modes planned: text input and voice input

# Current status:
# 1. Text input mode is implemented
# 1.1. Text response is generated and printed
# 1.2. Text-to-speech is not well integrated yet, need to check pyttsx3 documentation or use human-like voice library
# 2. Voice input mode is not implemented yet

import google.generativeai as genai
import os # for reading api key
# import pyttsx3

class Gemini:
    def __init__(self, api_key_file_path):
        self.api_key_file_path = api_key_file_path
        self.initialize_gemini(self.api_key_file_path)
        self.model = genai.GenerativeModel("gemini-1.5-flash-8b")
        # self.engine = pyttsx3.init()
        self.response = None # response from Gemini, to store the response from the model

    def initialize_gemini(self, api_key_file):
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

    def text_input_mode(self): # Get user input from text and write the conversation to a file
        while True:
            user_exit_keywords = ["exit", "q", "quit"]
            user_input = input(f"You (enter {user_exit_keywords} to quit): ")
            if user_input.lower() in user_exit_keywords:
                break
            response = self.model.generate_content(user_input)
            print(f"Gemini: {response.text}")
            with open("response.txt", "a") as file:
                file.write(f"User: {user_input}\n")
                file.write(f"Gemini: {response.text}\n")
            # print(response.usage_metadata) # Show token usage metadata
            # self.text_to_speech(response.text)

    def voice_input_mode(self):
        pass
    
    # def text_to_speech(self, text): # TODO: get the voice to sound more human-like
    #     self.engine.say(text)
    #     self.engine.runAndWait()

if __name__ == "__main__":
    api_key_file_path = "/home/pi/Projects/Gemini_API/api_key.txt"
    gemini = Gemini(api_key_file_path)
    gemini.text_input_mode()