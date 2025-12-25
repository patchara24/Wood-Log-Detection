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
    
    videoSelect.innerHTML = '<option value="">เลือกไฟล์วิดีโอ...</option>';
    
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
      alert("กรุณาเลือกไฟล์วิดีโอ");
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
            uploadStatus.textContent = "อัพโหลดสำเร็จ!";
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
            uploadStatus.textContent = "เกิดข้อผิดพลาด: " + data.message;
            uploadProgressBar.classList.add("bg-danger");
          }
        }
      });
      
      xhr.addEventListener("error", function () {
        uploadStatus.textContent = "เกิดข้อผิดพลาดในการอัพโหลด";
        uploadProgressBar.classList.add("bg-danger");
      });
      
      xhr.open("POST", "/upload_video");
      xhr.send(formData);
      
    } catch (error) {
      console.error("Upload error:", error);
      uploadStatus.textContent = "เกิดข้อผิดพลาด";
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
  uploadStatus.textContent = "กำลังอัพโหลด...";
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
      cameraSelect.innerHTML = '<option value="0">ไม่พบกล้องในระบบ</option>';
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
      '<option value="0">การเข้าถึงถูกปฏิเสธ/มีข้อผิดพลาด</option>';
    settingBtn.disabled = false;
  }
}

settingsModal.addEventListener("show.bs.modal", getCameraDevices);

saveCameraBtn.addEventListener("click", function () {
  selectedCameraId = cameraSelect.value;
  alert(
    `กล้องที่เลือกถูกบันทึก: ${
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
            <span class="badge bg-primary">${data.count} ชิ้น</span>
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
      classResultsContainer.innerHTML = '<p class="text-muted small">รอผลการประมวลผล...</p>';
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
    statusElement.innerHTML = `<i class="bi bi-check-circle me-1 text-success"></i> ประมวลผลล่าสุด: ${formatTimestamp(result.timestamp)}`;
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
    alert('กรุณาเริ่มการวิเคราะห์ก่อนถ่ายภาพ');
    return;
  }
  
  if (captureBtn) {
    captureBtn.disabled = true;
    captureBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> กำลังถ่าย...';
  }
  
  try {
    const response = await fetch('/capture', { method: 'POST' });
    const data = await response.json();
    
    if (data.success) {
      console.log('Capture successful:', data.result);
      updateResultsDisplay(data.result);
    } else {
      alert('เกิดข้อผิดพลาด: ' + data.message);
    }
  } catch (error) {
    console.error('Error capturing:', error);
    alert('เกิดข้อผิดพลาดในการถ่ายภาพ');
  } finally {
    if (captureBtn) {
      captureBtn.disabled = false;
      captureBtn.innerHTML = '<i class="bi bi-camera me-1"></i>ถ่าย';
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
        alert("กรุณาเลือกไฟล์วิดีโอก่อน");
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
    
    const sourceLabel = sourceType === "camera" ? "กล้อง" : "วิดีโอไฟล์";
    buttonText.innerHTML = '<i class="bi bi-stop-circle me-2"></i>หยุดการวิเคราะห์';
    statusElement.innerHTML = `<i class="bi bi-broadcast me-1"></i> กำลังเล่น${sourceLabel}... รอภาพนิ่งเพื่อถ่ายอัตโนมัติ`;

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
  buttonText.innerHTML = '<i class="bi bi-cpu me-2"></i>เริ่มการวิเคราะห์';
  statusElement.innerHTML = '<i class="bi bi-info-circle me-1"></i> รอการดำเนินการ';

  if (captureBtn) {
    captureBtn.disabled = true;
  }
  
  stopResultsPolling();
  isStreaming = false;
}

uploadBtn.onclick = startStreaming;
