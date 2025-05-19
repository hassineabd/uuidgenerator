import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-for-testing'
    DEBUG = os.environ.get('FLASK_DEBUG') or False
    
    # API limits
    API_RATE_LIMIT = "100 per day"
    
    # SEO Configuration
    SITE_TITLE = "UUID Generator - Create UUIDs and GUIDs easily"
    SITE_DESCRIPTION = "Generate UUID v1, v4, v5, GUID, QR codes, and hashes in just a few clicks. Free API available for developers."
    SITE_KEYWORDS = "uuid, guid, generator, uuid v4, uuid v1, uuid v5, qr code, uuid api, bulk uuid"
    
    # Monetag
    MONETAG_ID = os.environ.get('MONETAG_ID') or ''
    
    # Les paramètres de langue ont été supprimés 