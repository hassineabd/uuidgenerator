import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-for-testing'
    DEBUG = os.environ.get('FLASK_DEBUG') or False
    
    # API limits
    API_RATE_LIMIT = "100 per day"
    
    # SEO Configuration
    SITE_TITLE = "Générateur UUID - Créez des UUIDs et GUIDs facilement"
    SITE_DESCRIPTION = "Générez des UUID v1, v4, v5, GUID, QR codes, et hash en quelques clics. API gratuite disponible pour les développeurs."
    SITE_KEYWORDS = "uuid, guid, générateur, uuid v4, uuid v1, uuid v5, qr code, api uuid, bulk uuid"
    
    # Monetag
    MONETAG_ID = os.environ.get('MONETAG_ID') or '' 