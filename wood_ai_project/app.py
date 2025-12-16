import os
import logging
import numpy as np
import random
from flask import Flask, request, render_template, jsonify, Response
from PIL import Image
import io
import cv2 
import time 

# ------------------------------------------------------
# 1. System Configuration & Logging (ตั้งค่าระบบ)
# ------------------------------------------------------
app = Flask(__name__)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ------------------------------------------------------
# 2. AI Model Loading (ส่วนโหลดโมเดล)
# ------------------------------------------------------
ai_model = None
camera = None 

def load_ai_model():
    """โหลดโมเดล AI เมื่อเริ่มต้น Server"""
    global ai_model
    try:
        ai_model = "MOCK_MODE" 
        logger.info("System Status: AI Model loaded successfully (Mode: %s)", ai_model)
    except Exception as e:
        logger.error(f"Critical Error: Failed to load AI Model. {e}")
        ai_model = None

load_ai_model()

# ------------------------------------------------------
# 3. Webcam/Streaming Functions (ฟังก์ชันสตรีมมิ่ง)
# ------------------------------------------------------

def generate_frames(device_id):
    """
    ฟังก์ชันหลักสำหรับดึง Frame จากกล้อง, ประมวลผล AI, และส่ง Frame ออกไป
    รับ device_id เพื่อเลือกกล้องที่ถูกต้อง
    """
    global camera
    
    # หากกล้องกำลังทำงานอยู่แล้ว แต่มีการเรียก device_id ใหม่ เราต้อง release กล้องเดิมก่อน
    if camera is not None:
        camera.release()
        camera = None

    try:
        # พยายามแปลง device_id เป็น int ก่อน (สำหรับ Index 0, 1, ...)
        cam_index = int(device_id) 
        camera = cv2.VideoCapture(cam_index)
        logger.info(f"Camera initialized using index: {cam_index}")
    except ValueError:
        # ถ้าแปลงไม่ได้ แสดงว่าเป็น Device ID string (ใช้โดยตรงไม่ได้ในทุกระบบ แต่ลองใส่ไว้)
        camera = cv2.VideoCapture(device_id) 
        logger.info(f"Camera initialized using string ID: {device_id}")

    if not camera.isOpened():
        logger.error(f"Error: Could not open webcam with ID/Index: {device_id}")
        return

    frame_count = 0
    result_count = 0
    result_percentage = 0.0

    while True:
        success, frame = camera.read()
        if not success:
            logger.warning("Failed to grab frame. Breaking loop.")
            break
        
        frame_count += 1
        
        # 2. ประมวลผล AI (AI INFERENCE LOGIC)
        if ai_model == "MOCK_MODE":
            if frame_count % 30 == 0:
                result_count = random.randint(50, 150)
                result_percentage = round(random.uniform(85.0, 99.9), 2)
                
            height, width = frame.shape[:2]
            cv2.putText(frame, "AI Status: RUNNING (MOCK)", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.putText(frame, f"Count: {result_count}", (10, height - 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)
            cv2.putText(frame, f"Conf: {result_percentage:.2f}%", (10, height - 5), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)
            time.sleep(0.01) 
        
        # 3. เข้ารหัส Frame เป็น JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        # 4. Yield (ส่ง Frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# ------------------------------------------------------
# 4. Routes (เส้นทางเว็บไซต์)
# ------------------------------------------------------

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    """Endpoint สำหรับ Video Streaming (รับภาพ)"""
    # ดึง device_id จาก Query Parameter
    device_id = request.args.get('device_id', '0') 
    logger.info(f"Starting video feed for device ID: {device_id}")
    
    return Response(generate_frames(device_id),
                    mimetype='multipart/x-mixed-replace; boundary=frame')
                    
@app.route('/release_camera', methods=['POST'])
def release_camera():
    """Endpoint สำหรับให้ Frontend สั่งปล่อยทรัพยากรกล้อง (แก้ปัญหาไฟไม่ดับ)"""
    global camera
    if camera:
        camera.release()
        camera = None
        logger.info("Camera resource explicitly released by user action.")
        return jsonify({'success': True, 'message': 'Camera released successfully'})
    return jsonify({'success': False, 'message': 'Camera was not active'})
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)