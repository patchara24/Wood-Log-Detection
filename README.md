# 🌲 Wood AI Analytics: Real-Time Timber Counting System

ระบบวิเคราะห์และนับปริมาณท่อนไม้แบบ Real-Time ด้วยปัญญาประดิษฐ์ (YOLOv8) โดยใช้ Python Flask สำหรับ Backend และ Bootstrap/JavaScript สำหรับ Frontend รองรับการทำงานผ่าน Webcam พร้อมฟังก์ชันการเลือกกล้อง (Multi-Camera Support)

## 🚀 คุณสมบัติเด่น (Features)

- **Real-Time Detection:** ประมวลผลภาพจากกล้อง Webcam ด้วยโมเดล YOLOv8 ทันที
- **Multi-Camera Support:** มี UI สำหรับเลือกกล้องที่ต้องการใช้ผ่าน Settings Modal
- **Secure Camera Release:** แก้ปัญหาไฟกล้องติดค้างด้วยการสั่ง release ทรัพยากรอย่างชัดเจน
- **Fallback Mode:** มี `MOCK_MODE` สำหรับทดสอบ UI/UX ในกรณีที่ไม่สามารถโหลดโมเดล AI ได้

## 🛠️ การติดตั้งและการเตรียมความพร้อม (Installation & Setup)

### 1. โครงสร้างโปรเจกต์

## จัดโครงสร้างไฟล์ตามที่กำหนด:

```
/wood_log_project
├── app.py
├── yolo12n.pt <-- ไฟล์โมเดล AI ของคุณ (สำคัญ)
├── templates/
│ └── index.html
└── static/
  ├── script.js
  └── styles.css

```

### 2. ติดตั้ง Python และแพ็กเกจ

เปิด Terminal หรือ PowerShell ในโฟลเดอร์โปรเจกต์ของคุณ แล้วรันคำสั่งเพื่อติดตั้ง Dependencies ที่จำเป็น:

- Python 3.8+
- pip (Python Package Installer)
- Webcam ที่ใช้งานได้

โปรเจกต์นี้ใช้ไลบรารีที่สำคัญหลายตัว สามารถติดตั้งทั้งหมดได้ด้วยคำสั่งเดียว:

```bash
# แนะนำให้สร้าง Virtual Environment ก่อนเสมอ
python -m venv venv
source venv/bin/activate  # สำหรับ Linux/macOS
# venv\Scripts\activate   # สำหรับ Windows

# ติดตั้งไลบรารีที่จำเป็น
pip install flask opencv-python ultralytics numpy Pillow
```

## 💻 การรันโปรเจกต์ (How to Run)

1.  ตรวจสอบให้แน่ใจว่าคุณได้ติดตั้ง Dependencies ครบถ้วนแล้ว
2.  รันไฟล์ `app.py` ด้วยคำสั่ง:

    ```bash
    python app.py
    ```

3.  เปิด Web Browser และเข้าสู่ที่อยู่: `http://127.0.0.1:5000/`
4.  คลิกปุ่ม **"เริ่มการวิเคราะห์"** และอนุญาตให้เว็บไซต์เข้าถึงกล้องของคุณ

## 🔍 คำอธิบายโค้ดที่สำคัญ (Key Code Explanation)

| ไฟล์/ส่วน       | ฟังก์ชัน             | คำอธิบาย                                                                                   |
| :-------------- | :------------------- | :----------------------------------------------------------------------------------------- |
| **`app.py`**    | `generate_frames()`  | ดึงภาพจากกล้อง, ประมวลผลด้วย YOLO, วาด Bounding Box, และส่ง Frame ออกไปแบบ Multi-part JPEG |
| **`app.py`**    | `/video_feed`        | Endpoint ที่รับ `device_id` และเริ่มต้น `generate_frames` เพื่อสร้าง Video Stream          |
| **`app.py`**    | `/release_camera`    | API (POST) สำหรับสั่งให้ `cv2.VideoCapture` ปล่อยทรัพยากรกล้องอย่างชัดเจน                  |
| **`script.js`** | `getCameraDevices()` | ใช้ Web MediaDevices API เพื่อดึงรายชื่อกล้องสำหรับ Modal                                  |
| **`script.js`** | `startStreaming()`   | ควบคุมสถานะ Start/Stop สตรีมมิ่ง และเรียก API `/release_camera` เมื่อหยุด                  |
