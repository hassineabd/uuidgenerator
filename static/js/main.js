document.addEventListener('DOMContentLoaded', function() {
    // Gestion du formulaire UUID
    const uuidForm = document.getElementById('uuid-form');
    const uuidTypeSelect = document.getElementById('uuid-type');
    const v5Options = document.querySelector('.v5-options');
    const resultSection = document.getElementById('result');
    const uuidResult = document.getElementById('uuid-result');
    const copyUuidBtn = document.getElementById('copy-uuid');
    
    // Boutons d'actions
    const generateQrBtn = document.getElementById('generate-qr');
    const generateHashBtn = document.getElementById('generate-hash');
    const showCodeBtn = document.getElementById('show-code');
    
    // Sections de résultats
    const qrResult = document.getElementById('qr-result');
    const hashResult = document.getElementById('hash-result');
    const codeResult = document.getElementById('code-result');
    
    // Gestion du mode sombre
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Vérifier si le mode sombre est déjà activé
    if (localStorage.getItem('darkMode') === 'true') {
        body.classList.add('dark-mode');
        themeToggle.textContent = 'Mode Clair';
    }
    
    // Activer/désactiver le mode sombre
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        themeToggle.textContent = isDarkMode ? 'Mode Clair' : 'Mode Sombre';
    });
    
    // Afficher/masquer les options v5 en fonction du type d'UUID
    uuidTypeSelect.addEventListener('change', function() {
        if (this.value === 'v5') {
            v5Options.style.display = 'block';
        } else {
            v5Options.style.display = 'none';
        }
    });
    
    // Soumission du formulaire
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
            // Réinitialiser les sections de résultats
            qrResult.style.display = 'none';
            hashResult.style.display = 'none';
            codeResult.style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Une erreur est survenue lors de la génération de l\'UUID.');
        });
    });
    
    // Copier l'UUID
    copyUuidBtn.addEventListener('click', function() {
        uuidResult.select();
        document.execCommand('copy');
        showToast('UUID copié dans le presse-papiers');
    });
    
    // Générer QR Code
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
            
            // Configuration du bouton de téléchargement
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
            alert('Une erreur est survenue lors de la génération du QR code.');
        });
    });
    
    // Générer un hash
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
            alert('Une erreur est survenue lors de la génération du hash.');
        });
    });
    
    // Afficher/masquer les sections de résultats
    generateHashBtn.addEventListener('click', function() {
        qrResult.style.display = 'none';
        hashResult.style.display = 'block';
        codeResult.style.display = 'none';
        
        // Déclencher la génération de hash
        document.getElementById('generate-hash-btn').click();
    });
    
    showCodeBtn.addEventListener('click', function() {
        qrResult.style.display = 'none';
        hashResult.style.display = 'none';
        codeResult.style.display = 'block';
        
        // Déclencher la génération de code
        document.getElementById('generate-code-btn').click();
    });
    
    // Copier le hash
    document.getElementById('copy-hash').addEventListener('click', function() {
        const hashValue = document.getElementById('hash-value');
        hashValue.select();
        document.execCommand('copy');
        showToast('Hash copié dans le presse-papiers');
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
    
    // Style pour le toast
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