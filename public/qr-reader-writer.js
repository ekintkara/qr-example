document.getElementById('startButton').addEventListener('click', startQRCodeReader);

function startQRCodeReader() {
    const video = document.getElementById('video');
    const canvasElement = document.getElementById('canvas');
    const canvas = canvasElement.getContext('2d');
    const qrForm = document.getElementById('qrForm');
    const qrDataInput = document.getElementById('qrData');
    const qrCanvas = document.getElementById('qrCanvas');
    
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(function(stream) {
        video.srcObject = stream;
        video.setAttribute('playsinline', true); // iOS cihazlarda önemli
        video.play();
        requestAnimationFrame(tick);
    });

    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if (code) {
                // QR kodu okundu
                video.pause();
                qrForm.style.display = 'block';
                document.getElementById('submitData').addEventListener('click', function() {
                    const qrData = qrDataInput.value;
                    if (qrData) {
                        const qr = new QRious({
                            element: qrCanvas,
                            value: qrData,
                            size: 200,
                        });
                        alert('Yeni QR kod oluşturuldu!');
                    }
                });
                return;
            }
        }
        requestAnimationFrame(tick);
    }
}
