import os
import logging
import numpy as np
import random
from flask import Flask, request, render_template, jsonify
from PIL import Image
import io

# ------------------------------------------------------
# 1. System Configuration & Logging (ตั้งค่าระบบ)
# ------------------------------------------------------
app = Flask(__name__)

# ตั้งค่า Logging ให้ดูเป็นระบบ (แสดงเวลา และระดับความรุนแรง)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# กำหนดไฟล์ที่อนุญาต
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ------------------------------------------------------
# 2. AI Model Loading (ส่วนโหลดโมเดล)
# ------------------------------------------------------
ai_model = None

def load_ai_model():
    """โหลดโมเดล AI เมื่อเริ่มต้น Server"""
    global ai_model
    try:
        # -----------------------------------------------------------
        # [OPTION A] สำหรับ YOLOv8 / Ultralytics (แนะนำสำหรับงานนับไม้)
        # from ultralytics import YOLO
        # ai_model = YOLO('best.pt') 
        # -----------------------------------------------------------
        
        # -----------------------------------------------------------
        # [OPTION B] สำหรับ TensorFlow / Keras
        # from tensorflow.keras.models import load_model
        # ai_model = load_model('wood_model.h5')
        # -----------------------------------------------------------
        
        # [MOCK MODE] ใช้โหมดจำลองถ้ายังไม่มีไฟล์โมเดล
        ai_model = "MOCK_MODE" 
        logger.info("System Status: AI Model loaded successfully (Mode: %s)", ai_model)
        
    except Exception as e:
        logger.error(f"Critical Error: Failed to load AI Model. {e}")
        ai_model = None

# เรียกโหลดโมเดลทันทีที่รันแอป
load_ai_model()

# ------------------------------------------------------
# 3. Routes (เส้นทางเว็บไซต์)
# ------------------------------------------------------

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # ตรวจสอบว่ามีการส่งไฟล์มาหรือไม่
    if 'file' not in request.files:
        logger.warning("Rejecting request: No file part")
        return jsonify({"success": False, "error": "No file uploaded"}), 400
    
    file = request.files['file']

    if file.filename == '':
        logger.warning("Rejecting request: Empty filename")
        return jsonify({"success": False, "error": "No selected file"}), 400

    if not allowed_file(file.filename):
        logger.warning(f"Rejecting request: Invalid file type ({file.filename})")
        return jsonify({"success": False, "error": "Invalid file type. Only JPG/PNG allowed."}), 400

    try:
        # อ่านไฟล์รูปภาพ
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        logger.info(f"Processing image: {file.filename} Size: {image.size}")

        # ---------------------------------------------------
        # AI INFERENCE LOGIC
        # ---------------------------------------------------
        result_count = 0
        result_percentage = 0.0

        if ai_model == "MOCK_MODE":
            # *** Simulation Logic *** # สุ่มตัวเลขเพื่อให้ดูเหมือนทำงานจริงเวลากดปุ่มซ้ำ
            import time
            time.sleep(1.5) # หน่วงเวลาเล็กน้อยให้ User เห็น Loading Spinner
            result_count = random.randint(45, 120) # สุ่มจำนวนไม้
            result_percentage = round(random.uniform(75.0, 99.9), 2) # สุ่มความแม่นยำ
            
        elif ai_model:
            # *** Real Logic (ตัวอย่างสำหรับ YOLO) ***
            # results = ai_model(image)
            # result_count = len(results[0].boxes) # นับจำนวน Box ที่เจอ
            # result_percentage = results[0].boxes.conf.mean().item() * 100 # ค่าความมั่นใจเฉลี่ย
            pass
            
        else:
            raise Exception("AI Model not initialized")

        logger.info(f"Analysis Complete: Count={result_count}, Conf={result_percentage}%")

        return jsonify({
            "success": True,
            "count": result_count,
            "percentage": result_percentage
        })

    except Exception as e:
        logger.error(f"Processing Error: {str(e)}")
        return jsonify({"success": False, "error": "Internal Processing Error"}), 500

if __name__ == '__main__':
    # ปิด debug=True ใน Production เพื่อความปลอดภัย
    app.run(debug=True, port=5000)