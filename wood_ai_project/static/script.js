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

let isStreaming = false;
// ใช้ '0' เป็นค่าเริ่มต้น (กล้องหลัก)
let selectedCameraId = "0";

// ------------------------------------------------------------------
// 2. Camera Selection Logic (ตรรกะการเลือกกล้อง)
// ------------------------------------------------------------------

async function getCameraDevices() {
  // 1. ขออนุญาตเข้าถึงกล้อง/ไมค์ก่อน (จำเป็นเพื่อให้ enumerateDevices เห็นชื่อกล้อง)
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    // 2. ดึงรายชื่ออุปกรณ์
    const devices = await navigator.mediaDevices.enumerateDevices();

    // 3. กรองเฉพาะ Video Input (กล้อง)
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );

    cameraSelect.innerHTML = "";

    if (videoDevices.length === 0) {
      cameraSelect.innerHTML = '<option value="0">ไม่พบกล้องในระบบ</option>';
      settingBtn.disabled = true;
      return;
    }

    // 4. Populate Dropdown
    videoDevices.forEach((device, index) => {
      const option = document.createElement("option");
      option.value = device.deviceId;
      option.textContent = device.label || `Camera ${index + 1}`;

      // ตั้งค่า selected ตามค่าที่เคยเลือกไว้
      if (
        device.deviceId === selectedCameraId ||
        (index === 0 && selectedCameraId === "0")
      ) {
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    });

    // 5. หยุด Stream ที่ขอไปเมื่อตอนเริ่มต้น (เพื่อให้ไฟกล้องดับ ถ้าเปิดแค่เช็คชื่อ)
    stream.getTracks().forEach((track) => track.stop());
  } catch (err) {
    console.error("Error accessing media devices: ", err);
    cameraSelect.innerHTML =
      '<option value="0">การเข้าถึงถูกปฏิเสธ/มีข้อผิดพลาด</option>';
    settingBtn.disabled = false; // ยังเปิดปุ่มไว้เพื่อให้ลองใหม่ได้
  }
}

// Event เมื่อ Modal เปิด (เพื่อโหลดรายชื่อกล้องใหม่เสมอ)
settingsModal.addEventListener("show.bs.modal", getCameraDevices);

// Event เมื่อกดปุ่ม Save ใน Modal
saveCameraBtn.addEventListener("click", function () {
  selectedCameraId = cameraSelect.value;
  alert(
    `กล้องที่เลือกถูกบันทึก: ${
      cameraSelect.options[cameraSelect.selectedIndex].text
    }`
  );

  // ถ้ามีการ streaming อยู่ ให้สั่ง Stop แล้ว Start ใหม่เพื่อให้ใช้กล้องใหม่
  if (isStreaming) {
    // Stop (จะไปเรียก /release_camera ด้วย)
    startStreaming();
    // Start ใหม่ (หน่วงเวลานิดหน่อยเพื่อให้ทรัพยากรกล้องถูก release ก่อน)
    setTimeout(startStreaming, 1000); // หน่วงเวลา 1 วินาที
  }
});

// ------------------------------------------------------------------
// 3. Real-Time Streaming Logic (ตรรกะหลัก)
// ------------------------------------------------------------------

function startStreaming() {
  if (!isStreaming) {
    // A. Start Streaming
    // *** แก้ไข: ส่ง selectedCameraId เป็น Query Parameter ไปให้ Flask ***
    videoStream.src = `/video_feed?device_id=${selectedCameraId}`;

    videoStream.style.display = "block";
    placeholderText.style.display = "none";
    statusContainer.classList.add("d-none");
    dataContainer.classList.remove("d-none");

    // B. Change UI to Stop State
    uploadBtn.classList.remove("btn-primary-dark");
    uploadBtn.classList.add("btn-danger");
    buttonText.innerHTML =
      '<i class="bi bi-stop-circle me-2"></i>หยุดการวิเคราะห์';
    statusElement.textContent = "กำลังสตรีมมิ่งกล้อง... AI Online";

    isStreaming = true;
  } else {
    // A. Stop Streaming
    videoStream.src = ""; // หยุด Stream ใน Browser
    videoStream.style.display = "none";
    placeholderText.style.display = "block";

    statusContainer.classList.remove("d-none");
    dataContainer.classList.add("d-none");

    // B. เรียก API เพื่อสั่งให้ Server ปล่อยกล้อง
    fetch("/release_camera", { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        console.log("Release status:", data.message);
      })
      .catch((error) => {
        console.error("Error releasing camera:", error);
      });

    // C. Change UI to Start State
    uploadBtn.classList.remove("btn-danger");
    uploadBtn.classList.add("btn-primary-dark");
    buttonText.innerHTML = '<i class="bi bi-cpu me-2"></i>เริ่มการวิเคราะห์';
    statusElement.innerHTML =
      '<i class="bi bi-info-circle me-1"></i> รอการดำเนินการ';

    isStreaming = false;
  }
}

// ผูกฟังก์ชัน startStreaming เข้ากับปุ่ม
uploadBtn.onclick = startStreaming;
