import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-for-testing'
    DEBUG = os.environ.get('FLASK_DEBUG') or False
    
    # API limits
    API_RATE_LIMIT = "100 per day"
    
    # SEO Configuration
    SITE_TITLE = "Best UUID Generator Online | Create UUIDs & GUIDs Instantly"
    SITE_DESCRIPTION = "Free online UUID/GUID generator for developers. Create UUID v1, v4, v5, bulk UUIDs, QR codes & hashes instantly. Try our free API. No registration required."
    SITE_KEYWORDS = "uuid generator, guid generator, uuid, guid, uuid v4, uuid v1, uuid v5, qr code, bulk uuid generator, uuid api, online uuid generator, random uuid, free uuid generator"
    
    # Social Media SEO
    SITE_IMAGE = "/static/images/uuid-generator-preview.png" # Assurez-vous de créer cette image
    SITE_AUTHOR = "UUID Generator Tool"
    SITE_TWITTER = "@uuidgenerator" # Si vous avez un compte Twitter
    
    # Schema.org structured data
    SCHEMA_TYPE = "WebApplication"
    SCHEMA_NAME = "UUID Generator Online"
    SCHEMA_DESCRIPTION = "Free tool to generate UUIDs and GUIDs for developers and testers"
    
    # Additional SEO settings for international targeting
    PRIMARY_LOCALE = "en_US"
    ALTERNATE_LOCALES = ["en_GB", "en_IN", "en_CA", "de_DE", "pt_BR"]
    
    # Monetag
    MONETAG_ID = os.environ.get('MONETAG_ID') or ''
    
    # Les paramètres de langue ont été supprimés 