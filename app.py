from flask import Flask, render_template, request, jsonify, send_file
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from modules.uuid_generator import generate_uuid, generate_bulk_uuids, generate_custom_uuid, decode_uuid
from modules.qr_generator import generate_qr_code
from modules.hash_generator import generate_hash
from modules.api_handler import api_generate_uuid
from config import Config
import os
import datetime

app = Flask(__name__)
app.config.from_object(Config)

# Rate limiter for the API
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)

# Add global context for all templates
@app.context_processor
def inject_now():
    return {'now': datetime.datetime.now()}

@app.route('/')
def index():
    return render_template('index.html', 
                          title="UUID Generator", 
                          description="Generate UUIDs and GUIDs easily for your projects")

@app.route('/bulk')
def bulk():
    return render_template('bulk.html', 
                          title="Generate Bulk UUIDs - " + Config.SITE_TITLE,
                          description="Create thousands of UUIDs in seconds with our bulk generator.")

@app.route('/api')
def api_docs():
    return render_template('api.html', 
                          title="UUID API - Documentation - " + Config.SITE_TITLE,
                          description="Documentation for the free API to generate UUIDs programmatically.")

@app.route('/decoder')
def decoder():
    return render_template('decoder.html',
                          title="UUID Decoder - " + Config.SITE_TITLE,
                          description="Decode existing UUIDs to understand their version, variant, and structure.")

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
    
    # Limit the number to avoid abuse
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

@app.route('/decode-uuid', methods=['POST'])
def decode_uuid_route():
    uuid_string = request.form.get('uuid', '')
    result = decode_uuid(uuid_string)
    return jsonify(result)

@app.route('/api/v1/uuid', methods=['GET'])
@limiter.limit(Config.API_RATE_LIMIT)
def api_uuid():
    uuid_type = request.args.get('type', 'v4')
    count = int(request.args.get('count', 1))
    
    # Limit the number to avoid abuse
    if count > 100:
        count = 100
    
    result = api_generate_uuid(uuid_type, count)
    return jsonify(result)

@app.route('/api/v1/decode', methods=['GET'])
@limiter.limit(Config.API_RATE_LIMIT)
def api_decode_uuid():
    uuid_string = request.args.get('uuid', '')
    result = decode_uuid(uuid_string)
    return jsonify(result)

@app.route('/uuidguide')
def uuidguide():
    return render_template('uuidguide.html')

@app.route('/developer')
def developer():
    return render_template('developer.html', 
                          title="Developer Corner - UUID Implementation - " + Config.SITE_TITLE,
                          description="Learn how to implement UUID generation in different programming languages with code examples and best practices.",
                          task={'title': 'Titre par défaut'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    app.run(host='0.0.0.0', port=port) 