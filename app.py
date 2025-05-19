from flask import Flask, render_template, request, jsonify, send_file
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from modules.uuid_generator import generate_uuid, generate_bulk_uuids, generate_custom_uuid
from modules.qr_generator import generate_qr_code
from modules.hash_generator import generate_hash
from modules.api_handler import api_generate_uuid
from config import Config
import os
import datetime

app = Flask(__name__)
app.config.from_object(Config)

# Rate limiter pour l'API
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)

# Ajouter le contexte global pour tous les templates
@app.context_processor
def inject_now():
    return {'now': datetime.datetime.now()}

@app.route('/')
def index():
    return render_template('index.html', 
                          title=Config.SITE_TITLE,
                          description=Config.SITE_DESCRIPTION)

@app.route('/bulk')
def bulk():
    return render_template('bulk.html', 
                          title="Générer des UUIDs en masse - " + Config.SITE_TITLE,
                          description="Créez des milliers d'UUIDs en quelques secondes avec notre générateur en masse.")

@app.route('/api')
def api_docs():
    return render_template('api.html', 
                          title="API UUID - Documentation - " + Config.SITE_TITLE,
                          description="Documentation de l'API gratuite pour générer des UUIDs programmatiquement.")

@app.route('/generate', methods=['POST'])
def generate():
    uuid_type = request.form.get('type', 'v4')
    namespace = request.form.get('namespace', '')
    name = request.form.get('name', '')
    prefix = request.form.get('prefix', '')
    suffix = request.form.get('suffix', '')
    
    if prefix or suffix:
        uuid_value = generate_custom_uuid(uuid_type, prefix, suffix, namespace, name)
    else:
        uuid_value = generate_uuid(uuid_type, namespace, name)
    
    return jsonify({'uuid': uuid_value})

@app.route('/generate-bulk', methods=['POST'])
def generate_bulk():
    count = int(request.form.get('count', 10))
    uuid_type = request.form.get('type', 'v4')
    
    # Limiter le nombre pour éviter les abus
    if count > 1000:
        count = 1000
    
    uuids = generate_bulk_uuids(uuid_type, count)
    return jsonify({'uuids': uuids})

@app.route('/generate-qr', methods=['POST'])
def generate_qr():
    uuid_value = request.form.get('uuid', '')
    qr_path = generate_qr_code(uuid_value)
    return send_file(qr_path, mimetype='image/png')

@app.route('/generate-hash', methods=['POST'])
def hash_uuid():
    uuid_value = request.form.get('uuid', '')
    hash_type = request.form.get('hash_type', 'md5')
    hash_value = generate_hash(uuid_value, hash_type)
    return jsonify({'hash': hash_value})

@app.route('/api/v1/uuid', methods=['GET'])
@limiter.limit(Config.API_RATE_LIMIT)
def api_uuid():
    uuid_type = request.args.get('type', 'v4')
    count = int(request.args.get('count', 1))
    
    # Limiter le nombre pour éviter les abus
    if count > 100:
        count = 100
    
    result = api_generate_uuid(uuid_type, count)
    return jsonify(result)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    app.run(host='0.0.0.0', port=port) 