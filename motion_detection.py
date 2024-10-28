import cv2
import sys
import time

timeout = int(sys.argv[1])
camera = cv2.VideoCapture(0)

if not camera.isOpened():
    print("Fehler: Kamera kann nicht geöffnet werden")
    sys.exit(1)

last_motion_time = time.time()
motion_detected = False
reference_frame = None

while True:
    ret, frame = camera.read()
    if not ret:
        print("Fehler: Kamerabild kann nicht gelesen werden")
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (21, 21), 0)

    if reference_frame is None or reference_frame.shape != blurred.shape:
        reference_frame = blurred
        continue

    frame_delta = cv2.absdiff(reference_frame, blurred)
    thresh = cv2.threshold(frame_delta, 25, 255, cv2.THRESH_BINARY)[1]
    thresh = cv2.dilate(thresh, None, iterations=2)
    contours, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if len(contours) > 0:
        last_motion_time = time.time()
        print("MOTION_DETECTED")
    else:
        if time.time() - last_motion_time > timeout:
            print("NO_MOTION_DETECTED")

camera.release()
cv2.destroyAllWindows()
