import qrcode
import os
import tempfile
from pathlib import Path

def generate_qr_code(data):
    """
    Génère un QR code à partir des données fournies
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    
    # Créer un fichier temporaire pour l'image
    temp_dir = Path(tempfile.gettempdir())
    temp_file = temp_dir / f"qrcode_{hash(data)}.png"
    
    img.save(temp_file)
    return temp_file 