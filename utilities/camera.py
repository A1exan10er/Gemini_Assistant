import cv2

def take_picture(filename):
    # Initialize the camera
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not open camera.")
        return

    # Capture a single frame
    ret, frame = cap.read()

    if ret:
        # Save the captured image to a file
        cv2.imwrite(filename, frame)
        print(f"Picture saved as {filename}")
    else:
        print("Error: Could not capture image.")

    # Release the camera
    cap.release()
    
def main():
    take_picture("/home/pi/Projects/Gemini_API/utilities/captured_image.jpg")

if __name__ == "__main__":
    main()