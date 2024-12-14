# Test Raspberry Pi sound output

import pyttsx3

sentence = "The quick brown fox jumps over the lazy dog."

def text_to_speech(text):
    engine = pyttsx3.init()
    
    # Adjust the rate
    rate = engine.getProperty('rate')
    engine.setProperty('rate', rate - 800)  # Decrease the rate for better clarity
    
    # Adjust the volume
    volume = engine.getProperty('volume')
    engine.setProperty('volume', volume + 0.25)  # Increase the volume
    
    # Select a different voice if available
    voices = engine.getProperty('voices')
    engine.setProperty('voice', voices[3].id)  # Change to a different voice, e.g., female voice
    
    engine.say(text)
    engine.runAndWait()

text_to_speech(sentence)
