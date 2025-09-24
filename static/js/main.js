document.addEventListener('DOMContentLoaded', function() {
    // Get all required DOM elements
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const uuidTypeSelect = document.getElementById('uuid-type');
    const v5Options = document.querySelector('.v5-options');
    const uuidForm = document.getElementById('uuid-form');
    const uuidResult = document.getElementById('uuid-result');
    const resultSection = document.getElementById('result');
    const copyUuidBtn = document.getElementById('copy-uuid');
    const generateQrBtn = document.getElementById('generate-qr');
    const qrResult = document.getElementById('qr-result');
    const generateHashBtn = document.getElementById('generate-hash');
    const hashResult = document.getElementById('hash-result');
    const showCodeBtn = document.getElementById('show-code');
    const codeResult = document.getElementById('code-result');
    
    // Check if we're on a page that has all these elements
    const isUuidGeneratorPage = uuidForm && resultSection;
    
    // Set theme based on localStorage
    if (themeToggle) {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        if (savedDarkMode) {
            body.classList.add('dark-mode');
            themeToggle.textContent = 'Light Mode';
        } else {
            themeToggle.textContent = 'Dark Mode';
        }
        
        // Enable/disable dark mode
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            const isDarkMode = body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
            themeToggle.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
        });
    }
    
    // Only add UUID-specific event listeners if we're on the UUID generator page
    if (isUuidGeneratorPage) {
        // Show/hide v5 options depending on UUID type
        if (uuidTypeSelect && v5Options) {
            uuidTypeSelect.addEventListener('change', function() {
                if (this.value === 'v5') {
                    v5Options.style.display = 'block';
                } else {
                    v5Options.style.display = 'none';
                }
            });
        }
        
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
                if (qrResult) qrResult.style.display = 'none';
                if (hashResult) hashResult.style.display = 'none';
                if (codeResult) codeResult.style.display = 'none';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while generating the UUID.');
            });
        });
        
        // Copy UUID
        if (copyUuidBtn) {
            copyUuidBtn.addEventListener('click', function() {
                uuidResult.select();
                document.execCommand('copy');
                showToast('UUID copied to clipboard');
            });
        }
        
        // Generate QR Code
        if (generateQrBtn) {
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
                    if (qrImage) {
                        qrImage.innerHTML = `<img src="${url}" alt="QR Code" style="max-width: 200px;">`;
                        if (qrResult) qrResult.style.display = 'block';
                        if (hashResult) hashResult.style.display = 'none';
                        if (codeResult) codeResult.style.display = 'none';
                        
                        // Download button configuration
                        const downloadQrBtn = document.getElementById('download-qr');
                        if (downloadQrBtn) {
                            downloadQrBtn.onclick = function() {
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `uuid-qr-${uuid.slice(0, 8)}.png`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            };
                        }
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while generating the QR code.');
                });
            });
        }
        
        // Generate a hash
        const generateHashBtnInline = document.getElementById('generate-hash-btn');
        if (generateHashBtnInline) {
            generateHashBtnInline.addEventListener('click', function() {
                const uuid = uuidResult.value;
                const hashType = document.getElementById('hash-type');
                if (!uuid || !hashType) return;
                
                const formData = new FormData();
                formData.append('uuid', uuid);
                formData.append('hash_type', hashType.value);
                
                fetch('/generate-hash', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    const hashValue = document.getElementById('hash-value');
                    if (hashValue) {
                        hashValue.value = data.hash;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while generating the hash.');
                });
            });
        }
        
        // Show/hide result sections
        if (generateHashBtn && hashResult) {
            generateHashBtn.addEventListener('click', function() {
                if (qrResult) qrResult.style.display = 'none';
                hashResult.style.display = 'block';
                if (codeResult) codeResult.style.display = 'none';
                
                // Trigger hash generation
                const generateHashBtn = document.getElementById('generate-hash-btn');
                if (generateHashBtn) {
                    generateHashBtn.click();
                }
            });
        }
        
        if (showCodeBtn && codeResult) {
            showCodeBtn.addEventListener('click', function() {
                if (qrResult) qrResult.style.display = 'none';
                if (hashResult) hashResult.style.display = 'none';
                codeResult.style.display = 'block';
                
                // Trigger code generation
                const generateCodeBtn = document.getElementById('generate-code-btn');
                if (generateCodeBtn) {
                    generateCodeBtn.click();
                }
            });
        }
        
        // Copy the hash
        const copyHashBtn = document.getElementById('copy-hash');
        if (copyHashBtn) {
            copyHashBtn.addEventListener('click', function() {
                const hashValue = document.getElementById('hash-value');
                if (hashValue) {
                    hashValue.select();
                    document.execCommand('copy');
                    showToast('Hash copied to clipboard');
                }
            });
        }
    }
    
    // FAQ accordion behaviour
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach((question) => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', (!isExpanded).toString());
            const answer = this.nextElementSibling;
            if (answer) {
                answer.hidden = isExpanded;
            }
        });
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
    
    // Make toast function available globally
    window.showToast = showToast;
    
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
