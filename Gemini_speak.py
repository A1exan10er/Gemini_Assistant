# Get text response from "Gemini_listen.py" and use it as input for "Gemini_speak.py"
# Text-to-speech is not well integrated yet, need to check pyttsx3 documentation or use human-like voice library

import pyttsx3
from Gemini_listen import Gemini
import threading
import time
import sys, os

# Initialize the pyttsx3 engine once
engine = pyttsx3.init()

# Flag to indicate if the text input mode is running
running = True

def main():
    global running
    api_key_file_path = "/home/pi/Projects/Gemini_API/api_key.txt"
    gemini = Gemini(api_key_file_path)
    
    # Start the text input mode in a separate thread
    thread = threading.Thread(target=run_text_input_mode, args=(gemini,))
    thread.start()
    
    last_line = ""
    if os.path.exists("response.txt"):
        with open("response.txt", "r") as file:
            lines = file.readlines()
            # print(lines)
            if lines:
                last_line = lines[-1]
    
    # Continuously read the response from the file and convert it to speech
    while running:
        with open("response.txt", "r") as file:
            lines = file.readlines()
            if lines[-1] != last_line:
                last_line = lines[-1]
                # clear_console_line()
                print(last_line.strip())
                text_to_speech(last_line.strip())
        time.sleep(1)  # Add a delay to avoid excessive file reading

def run_text_input_mode(gemini):
    global running
    gemini.text_input_mode()
    running = False  # Set the flag to False when text_input_mode exits

def text_to_speech(text):
    engine.say(text)
    engine.runAndWait()

def clear_console_line():
    sys.stdout.write('\r')
    sys.stdout.flush()

if __name__ == "__main__":
    main()