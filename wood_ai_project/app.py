import os
import logging
import numpy as np
import random
from flask import Flask, request, render_template, jsonify, Response
from PIL import Image
from ultralytics import YOLO
import io
import cv2 
import time 
from datetime import datetime

# ------------------------------------------------------
# 1. System Configuration & Logging (ตั้งค่าระบบ)
# ------------------------------------------------------
app = Flask(__name__)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Configuration Parameters
STABILITY_THRESHOLD = 0.5       # ค่าความแตกต่างของ frame ที่ยอมรับ (user กำหนด)
STABILITY_FRAMES = 10           # จำนวน frame นิ่งต่อเนื่องก่อนถ่าย
CAPTURE_COOLDOWN = 3.0          # ระยะเวลารอระหว่างการถ่ายภาพ (วินาที)
BOUNDING_CONF = 0.5             # Confidence threshold สำหรับ bounding
SEGMENT_CONF = 0.3              # Confidence threshold สำหรับ segment

# สร้างโฟลเดอร์เก็บผลลัพธ์
CAPTURES_DIR = os.path.join(os.path.dirname(__file__), 'captures')
CROPPED_DIR = os.path.join(CAPTURES_DIR, 'cropped')
SEGMENTED_DIR = os.path.join(CAPTURES_DIR, 'segmented')
MASKS_DIR = os.path.join(CAPTURES_DIR, 'masks')
VIDEOS_DIR = os.path.join(os.path.dirname(__file__), 'videos')  # สำหรับเก็บวิดีโอทดสอบ

for dir_path in [CAPTURES_DIR, CROPPED_DIR, SEGMENTED_DIR, MASKS_DIR, VIDEOS_DIR]:
    os.makedirs(dir_path, exist_ok=True)

# Global state for video source
current_video_source = None  # 'camera' หรือ 'video_file'
current_video_path = None

# ------------------------------------------------------
# 2. AI Model Loading (ส่วนโหลดโมเดล)
# ------------------------------------------------------
bounding_model = None  # โมเดลสำหรับ bounding box detection
segment_model = None   # โมเดลสำหรับ segmentation
camera = None 

# Global state for frame stability detection
prev_frame = None
stable_frame_count = 0
last_capture_time = 0
latest_result = None  # เก็บผลลัพธ์ล่าสุดสำหรับแสดงใน UI

def load_ai_models():
    """โหลดโมเดล AI ทั้ง 2 ตัวเมื่อเริ่มต้น Server"""
    global bounding_model, segment_model
    try:
        bounding_model = YOLO('bounding_model.pt')
        logger.info("Bounding Model loaded successfully (bounding_model.pt)")
    except Exception as e:
        logger.error(f"Failed to load Bounding Model: {e}")
        bounding_model = None
    
    try:
        segment_model = YOLO('best.pt')
        logger.info("Segment Model loaded successfully (best.pt)")
    except Exception as e:
        logger.error(f"Failed to load Segment Model: {e}")
        segment_model = None

load_ai_models()

# ------------------------------------------------------
# 3. Frame Stability Detection (ตรวจจับภาพนิ่ง)
# ------------------------------------------------------

def is_frame_stable(current_frame):
    """
    ตรวจสอบว่า frame ปัจจุบันนิ่งหรือไม่
    โดยเปรียบเทียบกับ frame ก่อนหน้า
    """
    global prev_frame, stable_frame_count
    
    if prev_frame is None:
        prev_frame = current_frame.copy()
        return False
    
    # แปลงเป็น grayscale สำหรับเปรียบเทียบ
    gray_current = cv2.cvtColor(current_frame, cv2.COLOR_BGR2GRAY)
    gray_prev = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)
    
    # หาความแตกต่างระหว่าง frame
    diff = cv2.absdiff(gray_current, gray_prev)
    mean_diff = np.mean(diff)
    
    # อัพเดท frame ก่อนหน้า
    prev_frame = current_frame.copy()
    
    # ตรวจสอบว่านิ่งหรือไม่
    if mean_diff < STABILITY_THRESHOLD:
        stable_frame_count += 1
    else:
        stable_frame_count = 0
    
    return stable_frame_count >= STABILITY_FRAMES

# ------------------------------------------------------
# 4. AI Processing Pipeline (ประมวลผล AI)
# ------------------------------------------------------

def process_captured_image(image, timestamp_str):
    """
    ประมวลผลภาพที่ถ่ายด้วย pipeline:
    1. Bounding Detection → Crop
    2. Segmentation บนแต่ละ crop
    3. บันทึก mask images และคำนวณ class %
    """
    global latest_result
    
    result_data = {
        'timestamp': timestamp_str,
        'original_path': None,
        'crops': [],
        'class_percentages': {},
        'total_objects': 0
    }
    
    # บันทึกภาพต้นฉบับ
    original_path = os.path.join(CAPTURES_DIR, f'original_{timestamp_str}.jpg')
    cv2.imwrite(original_path, image)
    result_data['original_path'] = original_path
    logger.info(f"Saved original image: {original_path}")
    
    if bounding_model is None:
        logger.error("Bounding model not loaded")
        return result_data
    
    # Stage 1: Bounding Detection
    bounding_results = bounding_model(image, conf=BOUNDING_CONF, verbose=False)
    
    all_segment_classes = {}
    crop_count = 0
    
    for r in bounding_results:
        if r.boxes is None or len(r.boxes) == 0:
            logger.info("No objects detected by bounding model")
            continue
            
        for i, box in enumerate(r.boxes):
            # ดึงพิกัด bounding box
            x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
            conf = float(box.conf[0])
            
            # Crop ภาพตาม bounding box
            cropped = image[y1:y2, x1:x2].copy()
            
            if cropped.size == 0:
                continue
            
            crop_count += 1
            crop_filename = f'crop_{timestamp_str}_{crop_count}.jpg'
            crop_path = os.path.join(CROPPED_DIR, crop_filename)
            cv2.imwrite(crop_path, cropped)
            
            crop_data = {
                'path': crop_path,
                'bbox': [int(x1), int(y1), int(x2), int(y2)],
                'confidence': conf,
                'segments': []
            }
            
            # Stage 2: Segmentation บน cropped image
            if segment_model is not None:
                segment_results = segment_model(cropped, conf=SEGMENT_CONF, verbose=False)
                
                for seg_r in segment_results:
                    if seg_r.masks is not None and len(seg_r.masks) > 0:
                        # บันทึก mask image
                        mask_combined = np.zeros(cropped.shape[:2], dtype=np.uint8)
                        
                        for j, (mask, cls_id) in enumerate(zip(seg_r.masks.data, seg_r.boxes.cls)):
                            mask_np = mask.cpu().numpy()
                            # Resize mask to match cropped image size
                            mask_resized = cv2.resize(mask_np, (cropped.shape[1], cropped.shape[0]))
                            mask_binary = (mask_resized > 0.5).astype(np.uint8) * 255
                            
                            # เก็บ mask แยกตาม class
                            class_name = seg_r.names[int(cls_id)]
                            mask_filename = f'mask_{timestamp_str}_{crop_count}_{j}_{class_name}.png'
                            mask_path = os.path.join(MASKS_DIR, mask_filename)
                            cv2.imwrite(mask_path, mask_binary)
                            
                            # รวม mask
                            mask_combined = cv2.bitwise_or(mask_combined, mask_binary)
                            
                            # นับจำนวน class
                            if class_name not in all_segment_classes:
                                all_segment_classes[class_name] = 0
                            all_segment_classes[class_name] += 1
                            
                            crop_data['segments'].append({
                                'class': class_name,
                                'mask_path': mask_path,
                                'confidence': float(seg_r.boxes.conf[j])
                            })
                        
                        # บันทึก combined mask
                        combined_mask_path = os.path.join(MASKS_DIR, f'combined_{timestamp_str}_{crop_count}.png')
                        cv2.imwrite(combined_mask_path, mask_combined)
                        
                        # สร้างภาพ segmentation overlay
                        overlay = cropped.copy()
                        overlay[mask_combined > 0] = [0, 255, 0]  # สีเขียวสำหรับ segment
                        segmented_img = cv2.addWeighted(cropped, 0.7, overlay, 0.3, 0)
                        segmented_path = os.path.join(SEGMENTED_DIR, f'segmented_{timestamp_str}_{crop_count}.jpg')
                        cv2.imwrite(segmented_path, segmented_img)
                        crop_data['segmented_path'] = segmented_path
            
            result_data['crops'].append(crop_data)
    
    # คำนวณ class percentages
    total_segments = sum(all_segment_classes.values())
    result_data['total_objects'] = total_segments
    
    if total_segments > 0:
        for class_name, count in all_segment_classes.items():
            percentage = (count / total_segments) * 100
            result_data['class_percentages'][class_name] = {
                'count': count,
                'percentage': round(percentage, 2)
            }
    
    latest_result = result_data
    logger.info(f"Processing complete. Total crops: {crop_count}, Total segments: {total_segments}")
    logger.info(f"Class distribution: {result_data['class_percentages']}")
    
    return result_data

# ------------------------------------------------------
# 5. Webcam/Streaming Functions (ฟังก์ชันสตรีมมิ่ง)
# ------------------------------------------------------

def generate_frames(device_id):
    """
    ฟังก์ชันหลักสำหรับดึง Frame จากกล้อง, ตรวจจับภาพนิ่ง, และประมวลผล AI
    """
    global camera, prev_frame, stable_frame_count, last_capture_time, latest_result
    
    # Reset state
    prev_frame = None
    stable_frame_count = 0
    
    if camera is not None:
        camera.release()
        camera = None

    try:
        cam_index = int(device_id) 
        camera = cv2.VideoCapture(cam_index)
        logger.info(f"Camera initialized using index: {cam_index}")
    except ValueError:
        camera = cv2.VideoCapture(device_id) 
        logger.info(f"Camera initialized using string ID: {device_id}")

    if not camera.isOpened():
        logger.error(f"Error: Could not open webcam with ID/Index: {device_id}")
        return

    while True:
        success, frame = camera.read()
        if not success:
            logger.warning("Failed to grab frame. Breaking loop.")
            break
        
        display_frame = frame.copy()
        current_time = time.time()
        
        # ตรวจสอบ frame stability
        is_stable = is_frame_stable(frame)
        
        # แสดงสถานะ stability บนหน้าจอ
        height, width = frame.shape[:2]
        if is_stable:
            cv2.putText(display_frame, "STATUS: STABLE", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.putText(display_frame, f"Stable frames: {stable_frame_count}", (10, 60), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            
            # ถ่ายภาพอัตโนมัติเมื่อนิ่งและผ่าน cooldown
            if current_time - last_capture_time > CAPTURE_COOLDOWN:
                timestamp_str = datetime.now().strftime('%Y%m%d_%H%M%S')
                logger.info(f"Auto-capturing image at {timestamp_str}")
                
                # แสดงข้อความว่ากำลังถ่าย
                cv2.putText(display_frame, "CAPTURING...", (width//2 - 100, height//2), 
                           cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 0, 255), 3)
                
                # ประมวลผลภาพ
                process_captured_image(frame, timestamp_str)
                last_capture_time = current_time
        else:
            cv2.putText(display_frame, "STATUS: MOVING", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            cv2.putText(display_frame, f"Motion detected ({stable_frame_count}/{STABILITY_FRAMES})", (10, 60), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
        
        # แสดงผลลัพธ์ล่าสุด
        if latest_result:
            y_pos = 100
            cv2.putText(display_frame, f"Last capture: {latest_result['timestamp']}", (10, y_pos), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
            y_pos += 25
            cv2.putText(display_frame, f"Total objects: {latest_result['total_objects']}", (10, y_pos), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
            
            for class_name, data in latest_result.get('class_percentages', {}).items():
                y_pos += 25
                text = f"{class_name}: {data['count']} ({data['percentage']:.1f}%)"
                cv2.putText(display_frame, text, (10, y_pos), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
        
        # เข้ารหัส Frame เป็น JPEG
        ret, buffer = cv2.imencode('.jpg', display_frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

# ------------------------------------------------------
# 6. Routes (เส้นทางเว็บไซต์)
# ------------------------------------------------------

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    """Endpoint สำหรับ Video Streaming"""
    device_id = request.args.get('device_id', '0') 
    logger.info(f"Starting video feed for device ID: {device_id}")
    
    return Response(generate_frames(device_id),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/capture', methods=['POST'])
def manual_capture():
    """Endpoint สำหรับถ่ายภาพแบบ manual"""
    global camera, last_capture_time
    
    if camera is None or not camera.isOpened():
        return jsonify({'success': False, 'message': 'Camera not active'})
    
    success, frame = camera.read()
    if not success:
        return jsonify({'success': False, 'message': 'Failed to capture frame'})
    
    timestamp_str = datetime.now().strftime('%Y%m%d_%H%M%S')
    result = process_captured_image(frame, timestamp_str)
    last_capture_time = time.time()
    
    return jsonify({
        'success': True, 
        'message': 'Image captured and processed',
        'result': {
            'timestamp': result['timestamp'],
            'total_objects': result['total_objects'],
            'class_percentages': result['class_percentages']
        }
    })

@app.route('/results')
def get_results():
    """Endpoint สำหรับดึงผลลัพธ์ล่าสุด"""
    global latest_result
    
    if latest_result is None:
        return jsonify({'success': False, 'message': 'No results available'})
    
    return jsonify({
        'success': True,
        'result': {
            'timestamp': latest_result['timestamp'],
            'total_objects': latest_result['total_objects'],
            'class_percentages': latest_result['class_percentages'],
            'crops_count': len(latest_result['crops'])
        }
    })
                    
@app.route('/release_camera', methods=['POST'])
def release_camera():
    """Endpoint สำหรับให้ Frontend สั่งปล่อยทรัพยากรกล้อง"""
    global camera, prev_frame, stable_frame_count
    if camera:
        camera.release()
        camera = None
        prev_frame = None
        stable_frame_count = 0
        logger.info("Camera resource explicitly released by user action.")
        return jsonify({'success': True, 'message': 'Camera released successfully'})
    return jsonify({'success': False, 'message': 'Camera was not active'})

# ------------------------------------------------------
# Video File Support (รองรับไฟล์วิดีโอ)
# ------------------------------------------------------

@app.route('/upload_video', methods=['POST'])
def upload_video():
    """Endpoint สำหรับอัพโหลดไฟล์วิดีโอ"""
    global current_video_path
    
    if 'video' not in request.files:
        return jsonify({'success': False, 'message': 'No video file provided'})
    
    video_file = request.files['video']
    if video_file.filename == '':
        return jsonify({'success': False, 'message': 'No video selected'})
    
    # บันทึกไฟล์วิดีโอ
    allowed_extensions = {'.mp4', '.avi', '.mov', '.mkv', '.webm'}
    file_ext = os.path.splitext(video_file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        return jsonify({'success': False, 'message': f'Invalid file type. Allowed: {allowed_extensions}'})
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f'video_{timestamp}{file_ext}'
    filepath = os.path.join(VIDEOS_DIR, filename)
    video_file.save(filepath)
    
    current_video_path = filepath
    logger.info(f"Video uploaded: {filepath}")
    
    return jsonify({
        'success': True, 
        'message': 'Video uploaded successfully',
        'filename': filename,
        'path': filepath
    })

@app.route('/list_videos')
def list_videos():
    """Endpoint สำหรับดูรายการวิดีโอที่อัพโหลดแล้ว"""
    videos = []
    for f in os.listdir(VIDEOS_DIR):
        if f.lower().endswith(('.mp4', '.avi', '.mov', '.mkv', '.webm')):
            filepath = os.path.join(VIDEOS_DIR, f)
            videos.append({
                'filename': f,
                'path': filepath,
                'size_mb': round(os.path.getsize(filepath) / (1024*1024), 2)
            })
    return jsonify({'success': True, 'videos': videos})

def generate_frames_from_video(video_path):
    """
    ฟังก์ชันสำหรับดึง Frame จากไฟล์วิดีโอ, ตรวจจับภาพนิ่ง, และประมวลผล AI
    """
    global camera, prev_frame, stable_frame_count, last_capture_time, latest_result
    
    # Reset state
    prev_frame = None
    stable_frame_count = 0
    
    if camera is not None:
        camera.release()
        camera = None

    camera = cv2.VideoCapture(video_path)
    logger.info(f"Video file opened: {video_path}")

    if not camera.isOpened():
        logger.error(f"Error: Could not open video file: {video_path}")
        return

    # ดึง FPS ของวิดีโอเพื่อจำลองความเร็วเล่น
    fps = camera.get(cv2.CAP_PROP_FPS)
    if fps <= 0:
        fps = 30
    frame_delay = 1.0 / fps

    while True:
        success, frame = camera.read()
        if not success:
            # ถ้าจบวิดีโอ ให้วนใหม่
            camera.set(cv2.CAP_PROP_POS_FRAMES, 0)
            prev_frame = None
            stable_frame_count = 0
            logger.info("Video ended, looping...")
            continue
        
        display_frame = frame.copy()
        current_time = time.time()
        
        # ตรวจสอบ frame stability
        is_stable = is_frame_stable(frame)
        
        # แสดงสถานะ stability บนหน้าจอ
        height, width = frame.shape[:2]
        if is_stable:
            cv2.putText(display_frame, "STATUS: STABLE", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.putText(display_frame, f"Stable frames: {stable_frame_count}", (10, 60), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            
            # ถ่ายภาพอัตโนมัติเมื่อนิ่งและผ่าน cooldown
            if current_time - last_capture_time > CAPTURE_COOLDOWN:
                timestamp_str = datetime.now().strftime('%Y%m%d_%H%M%S')
                logger.info(f"Auto-capturing frame at {timestamp_str}")
                
                cv2.putText(display_frame, "CAPTURING...", (width//2 - 100, height//2), 
                           cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 0, 255), 3)
                
                process_captured_image(frame, timestamp_str)
                last_capture_time = current_time
        else:
            cv2.putText(display_frame, "STATUS: MOVING", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            cv2.putText(display_frame, f"Motion detected ({stable_frame_count}/{STABILITY_FRAMES})", (10, 60), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
        
        # แสดงว่ากำลังเล่นจากไฟล์วิดีโอ
        cv2.putText(display_frame, "[VIDEO FILE]", (width - 150, 30), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 165, 0), 2)
        
        # แสดงผลลัพธ์ล่าสุด
        if latest_result:
            y_pos = 100
            cv2.putText(display_frame, f"Last capture: {latest_result['timestamp']}", (10, y_pos), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
            y_pos += 25
            cv2.putText(display_frame, f"Total objects: {latest_result['total_objects']}", (10, y_pos), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
            
            for class_name, data in latest_result.get('class_percentages', {}).items():
                y_pos += 25
                text = f"{class_name}: {data['count']} ({data['percentage']:.1f}%)"
                cv2.putText(display_frame, text, (10, y_pos), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
        
        # เข้ารหัส Frame เป็น JPEG
        ret, buffer = cv2.imencode('.jpg', display_frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        
        # หน่วงเวลาตาม FPS ของวิดีโอ
        time.sleep(frame_delay * 0.5)  # เร็วขึ้น 2 เท่าเพื่อทดสอบ

@app.route('/video_file_feed')
def video_file_feed():
    """Endpoint สำหรับ Video File Streaming"""
    video_path = request.args.get('path', '')
    
    if not video_path or not os.path.exists(video_path):
        return jsonify({'success': False, 'message': 'Video file not found'}), 404
    
    logger.info(f"Starting video file feed: {video_path}")
    
    return Response(generate_frames_from_video(video_path),
                    mimetype='multipart/x-mixed-replace; boundary=frame')
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)