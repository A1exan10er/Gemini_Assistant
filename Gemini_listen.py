# Gemini listens to user input and responds accordingly
# Author: Tianyu Yang
# Two modes planned: text input and voice input

# Current status:
# 1. Text input mode is implemented
# 1.1. Text response is generated and printed
# 1.2. Text-to-speech is not well integrated yet, need to check pyttsx3 documentation or use human-like voice library
# 2. Voice input mode is implemented (currently only English supported)
# 2.1. Listens to user voice input, converts to text, generates response, and prints it

import google.generativeai as genai
import speech_recognition as sr
# import pyttsx3

class Gemini:
    def __init__(self, api_key_file_path):
        self.api_key_file_path = api_key_file_path
        self.initialize_gemini(self.api_key_file_path)
        self.model = genai.GenerativeModel("gemini-2.5-flash")
        # self.engine = pyttsx3.init()
        self.response = None # response from Gemini, to store the response from the model
        self.recognizer = sr.Recognizer() # Initialize speech recognizer

    def initialize_gemini(self, api_key_file):
        try:
            with open(api_key_file, 'r') as file:
                api_key = file.read().strip() # read api key from file, strip removes whitespace if any
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
        """Get user input from voice and respond"""
        print("Voice input mode activated.")
        print("Press any key to start listening, or type 'exit' to quit.")
        
        while True:
            try:
                # Wait for user to press a key to activate listening
                user_trigger = input("\nPress Enter to speak (or type 'exit' to quit): ")
                
                # Check if user wants to exit
                if user_trigger.lower() in ["exit", "quit", "q"]:
                    print("Exiting voice input mode.")
                    break
                
                with sr.Microphone() as source:
                    print("Listening... (speak now, I'll detect when you stop)")
                    # Adjust for ambient noise
                    self.recognizer.adjust_for_ambient_noise(source, duration=0.5)
                    # Listen for audio - no timeout, automatically detects when user stops speaking
                    # phrase_time_limit removed so user can speak as long as needed
                    audio = self.recognizer.listen(source)
                    
                print("Processing your speech...")
                
                # Convert speech to text using Google Speech Recognition
                user_input = self.recognizer.recognize_google(audio)
                print(f"You said: {user_input}")
                
                # Check for exit keywords in speech
                if user_input.lower() in ["exit", "quit", "stop"]:
                    print("Exiting voice input mode.")
                    break
                
                # Generate response from Gemini
                print("Generating response...")
                response = self.model.generate_content(user_input)
                print(f"\nGemini: {response.text}")
                
                # Write conversation to file
                with open("response.txt", "a") as file:
                    file.write(f"User (voice): {user_input}\n")
                    file.write(f"Gemini: {response.text}\n")
                    
            except sr.UnknownValueError:
                print("Could not understand audio. Please speak clearly and try again.")
            except sr.RequestError as e:
                print(f"Could not request results from speech recognition service; {e}")
            except KeyboardInterrupt:
                print("\nExiting voice input mode.")
                break
            except Exception as e:
                print(f"Error: {e}")
    
    # def text_to_speech(self, text): # TODO: get the voice to sound more human-like
    #     self.engine.say(text)
    #     self.engine.runAndWait()

if __name__ == "__main__":
    import sys
    
    api_key_file_path = "API_key.txt"  # Updated to match current project structure
    gemini = Gemini(api_key_file_path)
    
    # Check command line arguments for mode selection
    if len(sys.argv) > 1 and sys.argv[1] in ["voice", "v", "-v"]:
        gemini.voice_input_mode()
    else:
        gemini.text_input_mode()