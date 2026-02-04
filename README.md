# 🌲 Wood AI Analytics: Real-Time Timber Detection System

ระบบวิเคราะห์และนับปริมาณท่อนไม้แบบ Real-Time ด้วยปัญญาประดิษฐ์ (YOLO) โดยใช้ **2-Stage AI Pipeline**:
1. **Bounding Detection** - ตรวจจับและ crop ท่อนไม้
2. **Segmentation** - วิเคราะห์รายละเอียดและแยกประเภท

รองรับทั้ง **Webcam** และ **ไฟล์วิดีโอ** สำหรับทดสอบจากหน้างานจริง

---

## ✨ คุณสมบัติเด่น

| Feature | Description |
|---------|-------------|
| 🎯 **2-Stage AI Pipeline** | ใช้ `bounding_model.pt` ตรวจจับ + `best.pt` ทำ segmentation |
| 📷 **Auto Capture** | ถ่ายภาพอัตโนมัติเมื่อตรวจพบภาพนิ่ง |
| 🎬 **Video File Support** | อัพโหลดวิดีโอจากหน้างานเพื่อทดสอบ |
| 📊 **Class Percentages** | แสดงผลแยกตาม class พร้อมเปอร์เซ็นต์ |
| 🖼️ **Mask Export** | บันทึก mask images แยกตาม class |
| 📹 **Multi-Camera** | รองรับการเลือกกล้องหลายตัว |
| 📜 **Analysis History** | บันทึกประวัติการวิเคราะห์อัตโนมัติ |
| 📥 **Export Reports** | ส่งออก CSV, Excel, PDF |
| 🌙 **Dark Mode** | รองรับธีมมืด/สว่าง |
| 🌐 **Multi-Language** | รองรับภาษาไทยและอังกฤษ |

---

## 🆕 ฟีเจอร์ใหม่ล่าสุด (v1.1)

### 📜 บันทึกประวัติการวิเคราะห์
- บันทึกผลการวิเคราะห์ทุกครั้งอัตโนมัติ
- แสดงในตารางพร้อม timestamp, จำนวน, และ class breakdown
- สามารถลบประวัติแต่ละรายการหรือลบทั้งหมด

### 📥 Export รายงาน
- **CSV** - สำหรับ spreadsheet ทั่วไป
- **Excel** - พร้อมหัวตารางสวยงาม
- **PDF** - รายงานพร้อมพิมพ์

### 🌙 Dark Mode
- สลับธีมได้จากปุ่มบน Navbar
- บันทึกการตั้งค่าอัตโนมัติ

### ✨ UI Enhancements
- Hero section ใหม่พร้อม gradient text
- Stat cards แสดง Accuracy, Speed, Real-time
- Toast notifications แทน alerts
- Animated counters และ micro-interactions

---

## 📁 โครงสร้างโปรเจค

```
wood_ai_project/
├── app.py                    # Flask Backend + AI Pipeline
├── bounding_model.pt         # โมเดลตรวจจับ Bounding Box
├── best.pt                   # โมเดล Segmentation
├── templates/
│   └── index.html            # หน้าเว็บหลัก
├── static/
│   ├── script.js             # Frontend Logic
│   └── styles.css            # CSS Styles
├── videos/                   # เก็บวิดีโอที่อัพโหลด
├── exports/                  # ไฟล์ export
│   └── history.json          # ประวัติการวิเคราะห์
└── captures/                 # ผลลัพธ์การประมวลผล
    ├── original_*.jpg        # ภาพต้นฉบับ
    ├── cropped/              # ภาพที่ crop แล้ว
    ├── segmented/            # ภาพ segmentation overlay
    └── masks/                # Mask images แยก class
```

---

## 🛠️ การติดตั้ง

### ความต้องการของระบบ
- Python 3.8+
- Webcam (ถ้าใช้กล้อง)
- GPU (แนะนำ สำหรับความเร็ว)

### ติดตั้ง Dependencies

```bash
# สร้าง Virtual Environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/macOS)
source venv/bin/activate

# ติดตั้งไลบรารี
pip install flask opencv-python ultralytics numpy Pillow openpyxl reportlab
```

---

## 🖥️ การใช้งาน

### 1. รันเซิร์ฟเวอร์

```bash
cd wood_ai_project
python app.py
```

เปิดเบราว์เซอร์ไปที่: **http://127.0.0.1:5000**

### 2. เลือกแหล่งวิดีโอ

#### ใช้กล้อง Webcam
1. เลือก **กล้อง Webcam**
2. กด **เริ่มการวิเคราะห์**
3. ระบบจะถ่ายภาพอัตโนมัติเมื่อภาพนิ่ง

#### ใช้ไฟล์วิดีโอ
1. เลือก **ไฟล์วิดีโอ**
2. กด **อัพโหลด** เพื่อเลือกไฟล์ (MP4, AVI, MOV, MKV, WebM)
3. เลือกวิดีโอจาก dropdown
4. กด **เริ่มการวิเคราะห์**

### 3. Export รายงาน
1. เลื่อนลงมาที่ส่วน **ประวัติการวิเคราะห์**
2. กดปุ่ม **CSV**, **Excel**, หรือ **PDF** เพื่อดาวน์โหลด

### 4. Dark Mode
- กดปุ่ม 🌙 **Dark** ที่ Navbar เพื่อสลับธีม

---

## ⚙️ การตั้งค่า (Configuration)

แก้ไขค่าเหล่านี้ใน `app.py`:

```python
STABILITY_THRESHOLD = 0.5    # ค่าความนิ่งของภาพ (ยิ่งต่ำ = ไวกว่า)
STABILITY_FRAMES = 10        # จำนวน frame นิ่งก่อนถ่าย
CAPTURE_COOLDOWN = 3.0       # วินาทีระหว่างการถ่ายแต่ละครั้ง
BOUNDING_CONF = 0.5          # Confidence สำหรับ bounding
SEGMENT_CONF = 0.3           # Confidence สำหรับ segmentation
```

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | หน้าเว็บหลัก |
| `/video_feed` | GET | Video stream จากกล้อง |
| `/video_file_feed` | GET | Video stream จากไฟล์ |
| `/capture` | POST | ถ่ายภาพแบบ manual |
| `/results` | GET | ดึงผลลัพธ์ล่าสุด |
| `/upload_video` | POST | อัพโหลดไฟล์วิดีโอ |
| `/list_videos` | GET | รายการวิดีโอที่อัพโหลด |
| `/release_camera` | POST | ปล่อยทรัพยากรกล้อง |
| `/history` | GET | ดึงประวัติการวิเคราะห์ |
| `/history/<id>` | DELETE | ลบประวัติเฉพาะรายการ |
| `/history/clear` | DELETE | ลบประวัติทั้งหมด |
| `/export/csv` | GET | Export เป็น CSV |
| `/export/excel` | GET | Export เป็น Excel |
| `/export/pdf` | GET | Export เป็น PDF |

---

## 📊 ผลลัพธ์

ระบบจะบันทึกผลลัพธ์ลงโฟลเดอร์ `captures/`:

- **original_*.jpg** - ภาพต้นฉบับที่ถ่าย
- **cropped/** - ภาพที่ crop จาก bounding box
- **segmented/** - ภาพที่มี segmentation overlay
- **masks/** - Mask images แยกตาม class (PNG)

---

## 🧠 AI Pipeline Flow

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   กล้อง/    │    │  Frame Stability │    │ bounding_model  │
│   วิดีโอ    │───▶│    Detection     │───▶│     .pt         │
└─────────────┘    └──────────────────┘    └────────┬────────┘
                                                    │
                   ┌──────────────────┐    ┌────────▼────────┐
                   │   บันทึก History │◀───│    best.pt      │
                   │   + แสดงผล %     │    │  Segmentation   │
                   └──────────────────┘    └─────────────────┘
```

---

## 🛡️ Tech Stack

| Category | Technology |
|----------|------------|
| Backend | Flask, Python 3.8+ |
| AI/ML | YOLO (Ultralytics), OpenCV |
| Frontend | HTML5, CSS3, JavaScript |
| UI Framework | Bootstrap 5.3 |
| Export | openpyxl (Excel), reportlab (PDF) |
| Storage | JSON (History), File System |

---

## 📝 License

© 2025 WoodAnalytics Corporation. All rights reserved.

