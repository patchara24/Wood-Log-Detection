const imageInput = document.getElementById('imageFile');
const previewImage = document.getElementById('previewImage');
const placeholderText = document.getElementById('placeholderText');
const statusElement = document.getElementById('status');
const countElement = document.getElementById('count');
const percentageElement = document.getElementById('percentage');
const errorMsg = document.getElementById('errorMsg');
const buttonText = document.getElementById('buttonText');
const spinner = document.getElementById('spinner');
const uploadBtn = document.getElementById('uploadBtn');

// ส่วนแสดงผล (Container)
const dataContainer = document.getElementById('dataContainer');
const statusContainer = document.getElementById('statusContainer');

imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        previewImage.src = URL.createObjectURL(file);
        previewImage.style.display = 'block';
        placeholderText.style.display = 'none';
    } else {
        previewImage.style.display = 'none';
        placeholderText.style.display = 'block';
    }
    
    // รีเซ็ต UI
    statusElement.innerHTML = `<i class="bi bi-file-earmark-check"></i> พร้อมสำหรับการวิเคราะห์: ${file ? file.name : ''}`;
    dataContainer.classList.add('d-none'); // ซ่อนผลลัพธ์เก่า
    statusContainer.classList.remove('d-none');
    errorMsg.textContent = '';
});

function uploadImage() {
    const file = imageInput.files[0];
    if (!file) {
        alert("กรุณาเลือกไฟล์รูปภาพก่อนดำเนินการ");
        return;
    }

    // A. Loading State
    statusElement.textContent = "กำลังประมวลผลข้อมูล... กรุณารอสักครู่";
    errorMsg.textContent = '';
    
    buttonText.classList.add('d-none');
    spinner.classList.remove('d-none');
    uploadBtn.disabled = true; // ป้องกันการกดซ้ำ

    const formData = new FormData();
    formData.append('file', file);

    // B. Call API
    fetch('/predict', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // C. Reset State
        buttonText.classList.remove('d-none');
        spinner.classList.add('d-none');
        uploadBtn.disabled = false;

        if (data.success) {
            statusContainer.classList.add('d-none'); // ซ่อนข้อความสถานะทั่วไป
            dataContainer.classList.remove('d-none'); // แสดงกล่องผลลัพธ์
            
            // อัปเดตตัวเลข
            countElement.textContent = data.count;
            percentageElement.textContent = `${data.percentage}%`;
        } else {
            statusElement.innerHTML = `<i class="bi bi-exclamation-triangle-fill text-danger"></i> เกิดข้อผิดพลาด`;
            errorMsg.textContent = `System Error: ${data.error}`;
        }
    })
    .catch(error => {
        buttonText.classList.remove('d-none');
        spinner.classList.add('d-none');
        uploadBtn.disabled = false;
        
        statusElement.innerHTML = `<i class="bi bi-wifi-off text-danger"></i> การเชื่อมต่อล้มเหลว`;
        errorMsg.textContent = `Network Error: ${error}`;
        console.error('Error:', error);
    });
}