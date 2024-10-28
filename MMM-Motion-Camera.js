import time
import sys
import cv2

def detect_motion(timeout):
    cap = cv2.VideoCapture(0)  # Verwende die USB-Kamera
    last_motion_time = time.time()

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (21, 21), 0)
        if 'last_frame' in locals():
            frame_diff = cv2.absdiff(last_frame, blurred)
            _, thresh = cv2.threshold(frame_diff, 25, 255, cv2.THRESH_BINARY)
            if thresh.sum() > 10000:
                last_motion_time = time.time()
                print("MOTION_DETECTED")
            elif time.time() - last_motion_time > timeout:
                print("NO_MOTION")

        last_frame = blurred
        time.sleep(1)  # 1 Sekunde Pause für weniger CPU-Last

if __name__ == "__main__":
    inactivity_timeout = int(sys.argv[1])
    detect_motion(inactivity_timeout)
