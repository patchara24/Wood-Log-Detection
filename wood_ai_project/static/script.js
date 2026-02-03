// ------------------------------------------------------------------
// 0. Internationalization (i18n) - Language Support
// ------------------------------------------------------------------

const translations = {
  th: {
    // Navbar & Header
    "nav.brand": "WoodAnalytics",
    "nav.enterprise": "Enterprise",
    "page.title": "AI-Vision Log Grading System: Automated Wood Classification for Smart Timber Processing",
    "page.subtitle": "AI-Powered Timber Quantity Estimation System (Webcam)",
    
    // Control Panel
    "panel.title": "แผงควบคุมการประมวลผล",
    "source.title": "เลือกแหล่งวิดีโอ",
    "source.camera": "กล้อง Webcam",
    "source.video": "ไฟล์วิดีโอ",
    "source.selectVideo": "เลือกไฟล์วิดีโอ...",
    "source.upload": "อัพโหลด",
    
    // Live Video Section
    "video.liveTitle": "Live Video Feed",
    "video.placeholder": "กด \"เริ่มการวิเคราะห์\" เพื่อเปิดกล้อง",
    "btn.startAnalysis": "เริ่มการวิเคราะห์",
    "btn.stopAnalysis": "หยุดการวิเคราะห์",
    "btn.capture": "ถ่าย",
    "btn.capturing": "กำลังถ่าย...",
    
    // Results Section
    "results.title": "ผลการวิเคราะห์ (Analysis Result)",
    "results.waiting": "รอการดำเนินการ",
    "results.objectCount": "จำนวนวัตถุ",
    "results.pieces": "ชิ้น",
    "results.status": "สถานะ",
    "results.autoCapture": "Auto Capture",
    "results.classTitle": "ผลแยกตาม Class",
    "results.waitingProcess": "รอผลการประมวลผล...",
    "results.lastProcess": "ประมวลผลล่าสุด:",
    "results.streaming": "กำลังเล่น{source}... รอภาพนิ่งเพื่อถ่ายอัตโนมัติ",
    "results.streamingCamera": "กล้อง",
    "results.streamingVideo": "วิดีโอไฟล์",
    
    // Footer
    "footer.serverStatus": "Server Status:",
    "footer.online": "Online",
    
    // Settings Modal
    "settings.title": "การตั้งค่ากล้อง",
    "settings.language": "ภาษา / Language",
    "settings.cameraDescription": "กรุณาเลือกกล้องที่ต้องการใช้สำหรับการวิเคราะห์ Real-Time",
    "settings.selectCamera": "เลือกอุปกรณ์กล้อง",
    "settings.loadingCameras": "กำลังโหลดรายชื่อกล้อง...",
    "settings.noCamera": "ไม่พบกล้องในระบบ",
    "settings.accessDenied": "การเข้าถึงถูกปฏิเสธ/มีข้อผิดพลาด",
    "settings.close": "ปิด",
    "settings.save": "บันทึกการตั้งค่า",
    "settings.cameraSaved": "กล้องที่เลือกถูกบันทึก:",
    
    // Upload Video Modal
    "upload.title": "อัพโหลดไฟล์วิดีโอ",
    "upload.description": "เลือกไฟล์วิดีโอจากหน้างานเพื่อทดสอบระบบ AI",
    "upload.selectFile": "เลือกไฟล์วิดีโอ",
    "upload.supportedFormats": "รองรับไฟล์: MP4, AVI, MOV, MKV, WebM",
    "upload.uploading": "กำลังอัพโหลด...",
    "upload.success": "อัพโหลดสำเร็จ!",
    "upload.error": "เกิดข้อผิดพลาด:",
    "upload.uploadError": "เกิดข้อผิดพลาดในการอัพโหลด",
    "upload.btn": "อัพโหลด",
    
    // Alerts
    "alert.selectVideo": "กรุณาเลือกไฟล์วิดีโอ",
    "alert.selectVideoFirst": "กรุณาเลือกไฟล์วิดีโอก่อน",
    "alert.startFirst": "กรุณาเริ่มการวิเคราะห์ก่อนถ่ายภาพ",
    "alert.captureError": "เกิดข้อผิดพลาดในการถ่ายภาพ",
    
    // History
    "history.title": "ประวัติการวิเคราะห์",
    "history.datetime": "วันที่-เวลา",
    "history.objects": "จำนวน",
    "history.classes": "ผลแยก Class",
    "history.actions": "ดำเนินการ",
    "history.empty": "ยังไม่มีประวัติการวิเคราะห์",
    "history.footer": "ประวัติจะถูกบันทึกอัตโนมัติหลังการวิเคราะห์",
    "history.records": "รายการ",
    "history.confirmDelete": "ต้องการลบประวัตินี้หรือไม่?",
    "history.confirmClear": "ต้องการลบประวัติทั้งหมดหรือไม่?",
    "history.deleted": "ลบประวัติสำเร็จ",
    "history.cleared": "ลบประวัติทั้งหมดสำเร็จ"
  },
  en: {
    // Navbar & Header
    "nav.brand": "WoodAnalytics",
    "nav.enterprise": "Enterprise",
    "page.title": "AI-Vision Log Grading System: Automated Wood Classification for Smart Timber Processing",
    "page.subtitle": "AI-Powered Timber Quantity Estimation System (Webcam)",
    
    // Control Panel
    "panel.title": "Processing Control Panel",
    "source.title": "Select Video Source",
    "source.camera": "Webcam",
    "source.video": "Video File",
    "source.selectVideo": "Select video file...",
    "source.upload": "Upload",
    
    // Live Video Section
    "video.liveTitle": "Live Video Feed",
    "video.placeholder": "Press \"Start Analysis\" to open camera",
    "btn.startAnalysis": "Start Analysis",
    "btn.stopAnalysis": "Stop Analysis",
    "btn.capture": "Capture",
    "btn.capturing": "Capturing...",
    
    // Results Section
    "results.title": "Analysis Result",
    "results.waiting": "Waiting for action",
    "results.objectCount": "Object Count",
    "results.pieces": "pieces",
    "results.status": "Status",
    "results.autoCapture": "Auto Capture",
    "results.classTitle": "Results by Class",
    "results.waitingProcess": "Waiting for processing...",
    "results.lastProcess": "Last processed:",
    "results.streaming": "Playing {source}... Waiting for stable frame to auto-capture",
    "results.streamingCamera": "camera",
    "results.streamingVideo": "video file",
    
    // Footer
    "footer.serverStatus": "Server Status:",
    "footer.online": "Online",
    
    // Settings Modal
    "settings.title": "Camera Settings",
    "settings.language": "Language",
    "settings.cameraDescription": "Please select a camera device for Real-Time analysis",
    "settings.selectCamera": "Select Camera Device",
    "settings.loadingCameras": "Loading camera list...",
    "settings.noCamera": "No camera found",
    "settings.accessDenied": "Access denied / Error occurred",
    "settings.close": "Close",
    "settings.save": "Save Settings",
    "settings.cameraSaved": "Selected camera saved:",
    
    // Upload Video Modal
    "upload.title": "Upload Video File",
    "upload.description": "Select a video file from the field to test the AI system",
    "upload.selectFile": "Select Video File",
    "upload.supportedFormats": "Supported formats: MP4, AVI, MOV, MKV, WebM",
    "upload.uploading": "Uploading...",
    "upload.success": "Upload successful!",
    "upload.error": "Error:",
    "upload.uploadError": "Upload error occurred",
    "upload.btn": "Upload",
    
    // Alerts
    "alert.selectVideo": "Please select a video file",
    "alert.selectVideoFirst": "Please select a video file first",
    "alert.startFirst": "Please start analysis before capturing",
    "alert.captureError": "Error capturing image",
    
    // History
    "history.title": "Analysis History",
    "history.datetime": "Date-Time",
    "history.objects": "Count",
    "history.classes": "Class Results",
    "history.actions": "Actions",
    "history.empty": "No analysis history yet",
    "history.footer": "History is automatically saved after each analysis",
    "history.records": "records",
    "history.confirmDelete": "Do you want to delete this record?",
    "history.confirmClear": "Do you want to clear all history?",
    "history.deleted": "Record deleted successfully",
    "history.cleared": "All history cleared successfully"
  }
};

let currentLang = localStorage.getItem('woodai-lang') || 'th';

function t(key) {
  return translations[currentLang][key] || translations['th'][key] || key;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('woodai-lang', lang);
  applyTranslations();
  
  // Update radio button state
  const langRadio = document.getElementById(lang === 'en' ? 'langEN' : 'langTH');
  if (langRadio) langRadio.checked = true;
}

function applyTranslations() {
  // Settings Modal
  const settingsTitle = document.getElementById('settingsModalLabel');
  if (settingsTitle) settingsTitle.textContent = t('settings.title');
  
  // Apply to elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  
  // Panel title
  const panelTitle = document.querySelector('.card-header h6');
  if (panelTitle) {
    panelTitle.innerHTML = `<i class="bi bi-camera-video me-2"></i>${t('panel.title')}`;
  }
  
  // Source selector
  const sourceTitle = document.querySelector('.mb-4.p-3 h6');
  if (sourceTitle) {
    sourceTitle.innerHTML = `<i class="bi bi-toggles me-1"></i>${t('source.title')}`;
  }
  
  // Source buttons
  const cameraLabel = document.querySelector('label[for="sourceCamera"]');
  if (cameraLabel) cameraLabel.innerHTML = `<i class="bi bi-camera-video me-1"></i>${t('source.camera')}`;
  
  const videoLabel = document.querySelector('label[for="sourceVideo"]');
  if (videoLabel) videoLabel.innerHTML = `<i class="bi bi-file-play me-1"></i>${t('source.video')}`;
  
  // Video select placeholder
  const videoSelectPlaceholder = document.querySelector('#videoSelect option[value=""]');
  if (videoSelectPlaceholder) videoSelectPlaceholder.textContent = t('source.selectVideo');
  
  // Upload button in source section
  const uploadBtnSource = document.querySelector('[data-bs-target="#uploadVideoModal"]');
  if (uploadBtnSource) uploadBtnSource.innerHTML = `<i class="bi bi-upload me-1"></i>${t('source.upload')}`;
  
  // Live video title
  const liveTitle = document.querySelector('.col-md-7 h6');
  if (liveTitle) liveTitle.textContent = t('video.liveTitle');
  
  // Placeholder text
  const placeholder = document.querySelector('#placeholderText span');
  if (placeholder) placeholder.textContent = t('video.placeholder');
  
  // Start/Stop button
  if (!isStreaming) {
    buttonText.innerHTML = `<i class="bi bi-cpu me-2"></i>${t('btn.startAnalysis')}`;
    statusElement.innerHTML = `<i class="bi bi-info-circle me-1"></i> ${t('results.waiting')}`;
  } else {
    buttonText.innerHTML = `<i class="bi bi-stop-circle me-2"></i>${t('btn.stopAnalysis')}`;
  }
  
  // Capture button (only if not in capturing state)
  if (captureBtn && !captureBtn.disabled) {
    captureBtn.innerHTML = `<i class="bi bi-camera me-1"></i>${t('btn.capture')}`;
  }
  
  // Results section title
  const resultsTitle = document.querySelector('.col-md-5 h6');
  if (resultsTitle) resultsTitle.textContent = t('results.title');
  
  // Object count label
  const objectCountLabel = document.querySelector('.bg-success-subtle small.text-success');
  if (objectCountLabel) objectCountLabel.textContent = t('results.objectCount');
  
  // Pieces label
  const piecesLabel = document.querySelector('.bg-success-subtle small.text-muted');
  if (piecesLabel) piecesLabel.textContent = t('results.pieces');
  
  // Status label
  const statusLabel = document.querySelector('.bg-primary-subtle small.text-primary');
  if (statusLabel) statusLabel.textContent = t('results.status');
  
  // Class results title
  const classTitle = document.querySelector('#dataContainer h6');
  if (classTitle) classTitle.innerHTML = `<i class="bi bi-pie-chart me-1"></i>${t('results.classTitle')}`;
  
  // Waiting for processing text in class results (if present)
  const waitingText = document.querySelector('#classResults p.text-muted');
  if (waitingText) waitingText.textContent = t('results.waitingProcess');
  
  // Footer
  const serverStatusLabel = document.querySelector('.card-footer small:first-child');
  if (serverStatusLabel) {
    serverStatusLabel.innerHTML = `<i class="bi bi-hdd-network me-1"></i> ${t('footer.serverStatus')} <span class="text-success">${t('footer.online')}</span>`;
  }
  
  // Settings modal close button
  const closeBtn = document.querySelector('#settingsModal .modal-footer .btn-secondary');
  if (closeBtn) closeBtn.textContent = t('settings.close');
  
  // Settings modal save button
  const saveBtn = document.getElementById('saveCameraBtn');
  if (saveBtn) saveBtn.textContent = t('settings.save');
  
  // Upload video modal
  const uploadModalTitle = document.getElementById('uploadVideoModalLabel');
  if (uploadModalTitle) uploadModalTitle.innerHTML = `<i class="bi bi-upload me-2"></i>${t('upload.title')}`;
  
  const uploadDesc = document.querySelector('#uploadVideoModal .modal-body > p');
  if (uploadDesc) uploadDesc.textContent = t('upload.description');
  
  const uploadFileLabel = document.querySelector('label[for="videoFileInput"]');
  if (uploadFileLabel) uploadFileLabel.textContent = t('upload.selectFile');
  
  const uploadFormText = document.querySelector('#uploadVideoModal .form-text');
  if (uploadFormText) uploadFormText.textContent = t('upload.supportedFormats');
  
  const uploadModalClose = document.querySelector('#uploadVideoModal .modal-footer .btn-secondary');
  if (uploadModalClose) uploadModalClose.textContent = t('settings.close');
  
  const uploadModalBtn = document.getElementById('uploadVideoBtn');
  if (uploadModalBtn && !uploadModalBtn.disabled) {
    uploadModalBtn.innerHTML = `<i class="bi bi-upload me-1"></i>${t('upload.btn')}`;
  }
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
  // Set initial language from localStorage
  const savedLang = localStorage.getItem('woodai-lang') || 'th';
  const langRadio = document.getElementById(savedLang === 'en' ? 'langEN' : 'langTH');
  if (langRadio) langRadio.checked = true;
  
  // Apply translations after DOM is ready
  setTimeout(applyTranslations, 100);
  
  // Listen for language selection changes
  document.querySelectorAll('input[name="langSelect"]').forEach(radio => {
    radio.addEventListener('change', function() {
      setLanguage(this.value);
    });
  });
});

// ------------------------------------------------------------------
// 1. Element References (อ้างอิงถึงองค์ประกอบ)
// ------------------------------------------------------------------
const placeholderText = document.getElementById("placeholderText");
const statusElement = document.getElementById("status");
const countElement = document.getElementById("count");
const percentageElement = document.getElementById("percentage");
const errorMsg = document.getElementById("errorMsg");
const buttonText = document.getElementById("buttonText");
const spinner = document.getElementById("spinner");
const uploadBtn = document.getElementById("uploadBtn");
const dataContainer = document.getElementById("dataContainer");
const statusContainer = document.getElementById("statusContainer");

const videoStream = document.getElementById("videoStream");
const cameraSelect = document.getElementById("cameraSelect");
const settingBtn = document.getElementById("settingBtn");
const saveCameraBtn = document.getElementById("saveCameraBtn");
const settingsModal = document.getElementById("settingsModal");

// Elements for capture
const captureBtn = document.getElementById("captureBtn");
const classResultsContainer = document.getElementById("classResults");

// Elements for video file support
const videoFileSection = document.getElementById("videoFileSection");
const videoSelect = document.getElementById("videoSelect");
const videoFileInput = document.getElementById("videoFileInput");
const uploadVideoBtn = document.getElementById("uploadVideoBtn");
const uploadProgress = document.getElementById("uploadProgress");
const uploadProgressBar = document.getElementById("uploadProgressBar");
const uploadStatus = document.getElementById("uploadStatus");

let isStreaming = false;
let selectedCameraId = "0";
let selectedVideoPath = "";
let sourceType = "camera"; // 'camera' or 'video'
let resultsPollingInterval = null;

// ------------------------------------------------------------------
// 2. Source Type Selection (เลือกแหล่งวิดีโอ)
// ------------------------------------------------------------------

document.querySelectorAll('input[name="sourceType"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    sourceType = this.value;
    if (sourceType === "video") {
      videoFileSection.classList.remove("d-none");
      loadVideoList();
    } else {
      videoFileSection.classList.add("d-none");
    }
    
    // Stop streaming when switching source
    if (isStreaming) {
      stopStreaming();
    }
  });
});

// ------------------------------------------------------------------
// 3. Video File Management (จัดการไฟล์วิดีโอ)
// ------------------------------------------------------------------

async function loadVideoList() {
  try {
    const response = await fetch('/list_videos');
    const data = await response.json();
    
    videoSelect.innerHTML = `<option value="">${t('source.selectVideo')}</option>`;
    
    if (data.success && data.videos.length > 0) {
      data.videos.forEach((video) => {
        const option = document.createElement("option");
        option.value = video.path;
        option.textContent = `${video.filename} (${video.size_mb} MB)`;
        videoSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error loading video list:", error);
  }
}

videoSelect.addEventListener("change", function () {
  selectedVideoPath = this.value;
});

// Upload video
if (uploadVideoBtn) {
  uploadVideoBtn.addEventListener("click", async function () {
    const file = videoFileInput.files[0];
    if (!file) {
      alert(t('alert.selectVideo'));
      return;
    }
    
    const formData = new FormData();
    formData.append("video", file);
    
    uploadProgress.classList.remove("d-none");
    uploadVideoBtn.disabled = true;
    
    try {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", function (e) {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          uploadProgressBar.style.width = percent + "%";
          uploadStatus.textContent = `กำลังอัพโหลด... ${percent}%`;
        }
      });
      
      xhr.addEventListener("load", function () {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          if (data.success) {
            uploadStatus.textContent = t('upload.success');
            uploadProgressBar.classList.remove("progress-bar-striped", "progress-bar-animated");
            uploadProgressBar.classList.add("bg-success");
            
            // Refresh video list and select the new video
            loadVideoList().then(() => {
              videoSelect.value = data.path;
              selectedVideoPath = data.path;
            });
            
            // Close modal after delay
            setTimeout(() => {
              const modal = bootstrap.Modal.getInstance(document.getElementById('uploadVideoModal'));
              modal.hide();
              resetUploadUI();
            }, 1500);
          } else {
            uploadStatus.textContent = t('upload.error') + " " + data.message;
            uploadProgressBar.classList.add("bg-danger");
          }
        }
      });
      
      xhr.addEventListener("error", function () {
        uploadStatus.textContent = t('upload.uploadError');
        uploadProgressBar.classList.add("bg-danger");
      });
      
      xhr.open("POST", "/upload_video");
      xhr.send(formData);
      
    } catch (error) {
      console.error("Upload error:", error);
      uploadStatus.textContent = t('upload.uploadError');
    } finally {
      uploadVideoBtn.disabled = false;
    }
  });
}

function resetUploadUI() {
  uploadProgress.classList.add("d-none");
  uploadProgressBar.style.width = "0%";
  uploadProgressBar.classList.remove("bg-success", "bg-danger");
  uploadProgressBar.classList.add("progress-bar-striped", "progress-bar-animated");
  uploadStatus.textContent = t('upload.uploading');
  videoFileInput.value = "";
}

// ------------------------------------------------------------------
// 4. Camera Selection Logic (ตรรกะการเลือกกล้อง)
// ------------------------------------------------------------------

async function getCameraDevices() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );

    cameraSelect.innerHTML = "";

    if (videoDevices.length === 0) {
      cameraSelect.innerHTML = `<option value="0">${t('settings.noCamera')}</option>`;
      settingBtn.disabled = true;
      return;
    }

    videoDevices.forEach((device, index) => {
      const option = document.createElement("option");
      option.value = device.deviceId;
      option.textContent = device.label || `Camera ${index + 1}`;

      if (
        device.deviceId === selectedCameraId ||
        (index === 0 && selectedCameraId === "0")
      ) {
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    });

    stream.getTracks().forEach((track) => track.stop());
  } catch (err) {
    console.error("Error accessing media devices: ", err);
    cameraSelect.innerHTML =
      `<option value="0">${t('settings.accessDenied')}</option>`;
    settingBtn.disabled = false;
  }
}

settingsModal.addEventListener("show.bs.modal", getCameraDevices);

saveCameraBtn.addEventListener("click", function () {
  selectedCameraId = cameraSelect.value;
  alert(
    `${t('settings.cameraSaved')} ${
      cameraSelect.options[cameraSelect.selectedIndex].text
    }`
  );

  if (isStreaming) {
    stopStreaming();
    setTimeout(startStreaming, 1000);
  }
});

// ------------------------------------------------------------------
// 5. Results Polling (ดึงผลลัพธ์แบบ real-time)
// ------------------------------------------------------------------

function startResultsPolling() {
  if (resultsPollingInterval) {
    clearInterval(resultsPollingInterval);
  }
  
  resultsPollingInterval = setInterval(fetchLatestResults, 2000);
}

function stopResultsPolling() {
  if (resultsPollingInterval) {
    clearInterval(resultsPollingInterval);
    resultsPollingInterval = null;
  }
}

async function fetchLatestResults() {
  try {
    const response = await fetch('/results');
    const data = await response.json();
    
    if (data.success && data.result) {
      updateResultsDisplay(data.result);
    }
  } catch (error) {
    console.error("Error fetching results:", error);
  }
}

function updateResultsDisplay(result) {
  if (countElement) {
    countElement.textContent = result.total_objects || 0;
  }
  
  if (classResultsContainer) {
    classResultsContainer.innerHTML = '';
    
    if (result.class_percentages && Object.keys(result.class_percentages).length > 0) {
      for (const [className, data] of Object.entries(result.class_percentages)) {
        const classDiv = document.createElement('div');
        classDiv.className = 'class-result-item p-2 mb-2 rounded bg-light';
        classDiv.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <span class="fw-bold text-dark">${className}</span>
            <span class="badge bg-primary">${data.count} ${t('results.pieces')}</span>
          </div>
          <div class="progress mt-1" style="height: 6px;">
            <div class="progress-bar bg-success" role="progressbar" 
                 style="width: ${data.percentage}%" 
                 aria-valuenow="${data.percentage}" aria-valuemin="0" aria-valuemax="100">
            </div>
          </div>
          <small class="text-muted">${data.percentage.toFixed(1)}%</small>
        `;
        classResultsContainer.appendChild(classDiv);
      }
    } else {
      classResultsContainer.innerHTML = `<p class="text-muted small">${t('results.waitingProcess')}</p>`;
    }
  }
  
  if (percentageElement && result.class_percentages) {
    const classes = Object.keys(result.class_percentages);
    if (classes.length > 0) {
      const firstClass = result.class_percentages[classes[0]];
      percentageElement.textContent = `${firstClass.percentage.toFixed(1)}%`;
    }
  }
  
  if (statusElement && result.timestamp) {
    statusElement.innerHTML = `<i class="bi bi-check-circle me-1 text-success"></i> ${t('results.lastProcess')} ${formatTimestamp(result.timestamp)}`;
  }
}

function formatTimestamp(ts) {
  if (ts && ts.length >= 15) {
    const time = ts.substring(9, 11) + ':' + ts.substring(11, 13) + ':' + ts.substring(13, 15);
    return time;
  }
  return ts;
}

// ------------------------------------------------------------------
// 6. Manual Capture (ถ่ายภาพ manual)
// ------------------------------------------------------------------

async function manualCapture() {
  if (!isStreaming) {
    alert(t('alert.startFirst'));
    return;
  }
  
  if (captureBtn) {
    captureBtn.disabled = true;
    captureBtn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> ${t('btn.capturing')}`;
  }
  
  try {
    const response = await fetch('/capture', { method: 'POST' });
    const data = await response.json();
    
    if (data.success) {
      console.log('Capture successful:', data.result);
      updateResultsDisplay(data.result);
    } else {
      alert(t('upload.error') + ' ' + data.message);
    }
  } catch (error) {
    console.error('Error capturing:', error);
    alert(t('alert.captureError'));
  } finally {
    if (captureBtn) {
      captureBtn.disabled = false;
      captureBtn.innerHTML = `<i class="bi bi-camera me-1"></i>${t('btn.capture')}`;
    }
  }
}

if (captureBtn) {
  captureBtn.onclick = manualCapture;
}

// ------------------------------------------------------------------
// 7. Streaming Logic (ตรรกะหลักสำหรับ streaming)
// ------------------------------------------------------------------

function startStreaming() {
  if (!isStreaming) {
    // Determine video source URL
    let feedUrl;
    if (sourceType === "camera") {
      feedUrl = `/video_feed?device_id=${selectedCameraId}`;
    } else {
      if (!selectedVideoPath) {
        alert(t('alert.selectVideoFirst'));
        return;
      }
      feedUrl = `/video_file_feed?path=${encodeURIComponent(selectedVideoPath)}`;
    }
    
    videoStream.src = feedUrl;
    videoStream.style.display = "block";
    placeholderText.style.display = "none";
    statusContainer.classList.add("d-none");
    dataContainer.classList.remove("d-none");

    uploadBtn.classList.remove("btn-primary-dark");
    uploadBtn.classList.add("btn-danger");
    
    const sourceLabel = sourceType === "camera" ? t('results.streamingCamera') : t('results.streamingVideo');
    buttonText.innerHTML = `<i class="bi bi-stop-circle me-2"></i>${t('btn.stopAnalysis')}`;
    statusElement.innerHTML = `<i class="bi bi-broadcast me-1"></i> ${t('results.streaming').replace('{source}', sourceLabel)}`;

    if (captureBtn) {
      captureBtn.disabled = false;
    }
    
    startResultsPolling();
    isStreaming = true;
  } else {
    stopStreaming();
  }
}

function stopStreaming() {
  videoStream.src = "";
  videoStream.style.display = "none";
  placeholderText.style.display = "block";

  statusContainer.classList.remove("d-none");
  dataContainer.classList.add("d-none");

  fetch("/release_camera", { method: "POST" })
    .then((response) => response.json())
    .then((data) => {
      console.log("Release status:", data.message);
    })
    .catch((error) => {
      console.error("Error releasing camera:", error);
    });

  uploadBtn.classList.remove("btn-danger");
  uploadBtn.classList.add("btn-primary-dark");
  buttonText.innerHTML = `<i class="bi bi-cpu me-2"></i>${t('btn.startAnalysis')}`;
  statusElement.innerHTML = `<i class="bi bi-info-circle me-1"></i> ${t('results.waiting')}`;

  if (captureBtn) {
    captureBtn.disabled = true;
  }
  
  stopResultsPolling();
  isStreaming = false;
}

uploadBtn.onclick = startStreaming;

// ------------------------------------------------------------------
// 8. History Management (จัดการประวัติ)
// ------------------------------------------------------------------

const historyBody = document.getElementById('historyBody');
const historyCount = document.getElementById('historyCount');
const historyEmptyRow = document.getElementById('historyEmptyRow');

async function loadHistory() {
  try {
    const response = await fetch('/history');
    const data = await response.json();
    
    if (data.success) {
      renderHistoryTable(data.history);
      if (historyCount) {
        historyCount.textContent = `${data.total} ${t('history.records')}`;
      }
    }
  } catch (error) {
    console.error('Error loading history:', error);
  }
}

function renderHistoryTable(history) {
  if (!historyBody) return;
  
  if (history.length === 0) {
    historyBody.innerHTML = `
      <tr id="historyEmptyRow">
        <td colspan="5" class="text-center text-muted py-4">
          <i class="bi bi-inbox fs-3 d-block mb-2"></i>
          <span>${t('history.empty')}</span>
        </td>
      </tr>
    `;
    return;
  }
  
  historyBody.innerHTML = history.map(h => {
    const classesHtml = renderClassBadges(h.class_percentages);
    const timestamp = formatHistoryTimestamp(h.timestamp);
    
    return `
      <tr data-id="${h.id}">
        <td class="fw-bold">${h.id}</td>
        <td><small>${timestamp}</small></td>
        <td><span class="badge bg-success">${h.total_objects}</span></td>
        <td>${classesHtml}</td>
        <td>
          <button class="btn btn-sm btn-outline-danger delete-history-btn" 
                  data-id="${h.id}" title="Delete">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
  
  // Add delete event listeners
  document.querySelectorAll('.delete-history-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.dataset.id);
      deleteHistory(id);
    });
  });
}

function renderClassBadges(classPercentages) {
  if (!classPercentages || Object.keys(classPercentages).length === 0) {
    return '<span class="text-muted">-</span>';
  }
  
  return Object.entries(classPercentages).map(([name, data]) => {
    const colorClass = getClassColor(name);
    return `<span class="badge ${colorClass} me-1">${name}: ${data.count} (${data.percentage}%)</span>`;
  }).join('');
}

function getClassColor(className) {
  const colors = ['bg-primary', 'bg-success', 'bg-info', 'bg-warning', 'bg-secondary'];
  const hash = className.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

function formatHistoryTimestamp(ts) {
  if (!ts || ts.length < 15) return ts;
  // Format: YYYYMMDD_HHMMSS -> YYYY-MM-DD HH:MM:SS
  const year = ts.substring(0, 4);
  const month = ts.substring(4, 6);
  const day = ts.substring(6, 8);
  const hour = ts.substring(9, 11);
  const min = ts.substring(11, 13);
  const sec = ts.substring(13, 15);
  return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}

async function deleteHistory(id) {
  if (!confirm(t('history.confirmDelete'))) return;
  
  try {
    const response = await fetch(`/history/${id}`, { method: 'DELETE' });
    const data = await response.json();
    
    if (data.success) {
      loadHistory();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error deleting history:', error);
  }
}

async function clearAllHistory() {
  if (!confirm(t('history.confirmClear'))) return;
  
  try {
    const response = await fetch('/history/clear', { method: 'DELETE' });
    const data = await response.json();
    
    if (data.success) {
      loadHistory();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error clearing history:', error);
  }
}

// Export functions
function exportCSV() {
  window.location.href = '/export/csv';
}

function exportExcel() {
  window.location.href = '/export/excel';
}

function exportPDF() {
  window.location.href = '/export/pdf';
}

// Event listeners for history section
document.addEventListener('DOMContentLoaded', function() {
  // Load history on page load
  loadHistory();
  
  // Export buttons
  const exportCSVBtn = document.getElementById('exportCSV');
  const exportExcelBtn = document.getElementById('exportExcel');
  const exportPDFBtn = document.getElementById('exportPDF');
  const refreshHistoryBtn = document.getElementById('refreshHistory');
  const clearHistoryBtn = document.getElementById('clearHistory');
  
  if (exportCSVBtn) exportCSVBtn.addEventListener('click', exportCSV);
  if (exportExcelBtn) exportExcelBtn.addEventListener('click', exportExcel);
  if (exportPDFBtn) exportPDFBtn.addEventListener('click', exportPDF);
  if (refreshHistoryBtn) refreshHistoryBtn.addEventListener('click', loadHistory);
  if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearAllHistory);
});

// Auto-refresh history when results are polled
const originalFetchLatestResults = fetchLatestResults;
fetchLatestResults = async function() {
  await originalFetchLatestResults();
  // Refresh history table when new results come in
  loadHistory();
};
