document.addEventListener('DOMContentLoaded', function() {
    // UUID form management
    const uuidForm = document.getElementById('uuid-form');
    const uuidTypeSelect = document.getElementById('uuid-type');
    const v5Options = document.querySelector('.v5-options');
    const resultSection = document.getElementById('result');
    const uuidResult = document.getElementById('uuid-result');
    const copyUuidBtn = document.getElementById('copy-uuid');
    
    // Action buttons
    const generateQrBtn = document.getElementById('generate-qr');
    const generateHashBtn = document.getElementById('generate-hash');
    const showCodeBtn = document.getElementById('show-code');
    
    // Result sections
    const qrResult = document.getElementById('qr-result');
    const hashResult = document.getElementById('hash-result');
    const codeResult = document.getElementById('code-result');
    
    // Dark mode management
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check if dark mode is already activated
    if (localStorage.getItem('darkMode') === 'true') {
        body.classList.add('dark-mode');
        themeToggle.textContent = 'Light Mode';
    }
    
    // Enable/disable dark mode
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        themeToggle.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
    });
    
    // Show/hide v5 options depending on UUID type
    uuidTypeSelect.addEventListener('change', function() {
        if (this.value === 'v5') {
            v5Options.style.display = 'block';
        } else {
            v5Options.style.display = 'none';
        }
    });
    
    // Form submission
    uuidForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(uuidForm);
        
        fetch('/generate', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            uuidResult.value = data.uuid;
            resultSection.style.display = 'block';
            // Reset result sections
            qrResult.style.display = 'none';
            hashResult.style.display = 'none';
            codeResult.style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while generating the UUID.');
        });
    });
    
    // Copy UUID
    copyUuidBtn.addEventListener('click', function() {
        uuidResult.select();
        document.execCommand('copy');
        showToast('UUID copied to clipboard');
    });
    
    // Generate QR Code
    generateQrBtn.addEventListener('click', function() {
        const uuid = uuidResult.value;
        if (!uuid) return;
        
        const formData = new FormData();
        formData.append('uuid', uuid);
        
        fetch('/generate-qr', {
            method: 'POST',
            body: formData
        })
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const qrImage = document.getElementById('qr-image');
            qrImage.innerHTML = `<img src="${url}" alt="QR Code" style="max-width: 200px;">`;
            qrResult.style.display = 'block';
            hashResult.style.display = 'none';
            codeResult.style.display = 'none';
            
            // Download button configuration
            const downloadQrBtn = document.getElementById('download-qr');
            downloadQrBtn.onclick = function() {
                const a = document.createElement('a');
                a.href = url;
                a.download = `uuid-qr-${uuid.slice(0, 8)}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while generating the QR code.');
        });
    });
    
    // Generate a hash
    document.getElementById('generate-hash-btn').addEventListener('click', function() {
        const uuid = uuidResult.value;
        const hashType = document.getElementById('hash-type').value;
        if (!uuid) return;
        
        const formData = new FormData();
        formData.append('uuid', uuid);
        formData.append('hash_type', hashType);
        
        fetch('/generate-hash', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('hash-value').value = data.hash;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while generating the hash.');
        });
    });
    
    // Show/hide result sections
    generateHashBtn.addEventListener('click', function() {
        qrResult.style.display = 'none';
        hashResult.style.display = 'block';
        codeResult.style.display = 'none';
        
        // Trigger hash generation
        document.getElementById('generate-hash-btn').click();
    });
    
    showCodeBtn.addEventListener('click', function() {
        qrResult.style.display = 'none';
        hashResult.style.display = 'none';
        codeResult.style.display = 'block';
        
        // Trigger code generation
        document.getElementById('generate-code-btn').click();
    });
    
    // Copy the hash
    document.getElementById('copy-hash').addEventListener('click', function() {
        const hashValue = document.getElementById('hash-value');
        hashValue.select();
        document.execCommand('copy');
        showToast('Hash copied to clipboard');
    });
    
    // Toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(function() {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Style for toast
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: var(--secondary-color);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
            z-index: 1000;
        }
        .toast.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}); 