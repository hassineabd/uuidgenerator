import uuid
import random
import string

def generate_uuid(uuid_type='v4', namespace=None, name=None):
    """
    Génère un UUID selon le type spécifié
    """
    if uuid_type == 'v1':
        return str(uuid.uuid1())
    elif uuid_type == 'v4':
        return str(uuid.uuid4())
    elif uuid_type == 'v5':
        if namespace and name:
            try:
                namespace_uuid = uuid.UUID(namespace)
                return str(uuid.uuid5(namespace_uuid, name))
            except ValueError:
                return str(uuid.uuid4())  # Fallback si namespace invalide
        else:
            # Utiliser un namespace par défaut si non fourni
            return str(uuid.uuid5(uuid.NAMESPACE_DNS, name or ''.join(random.choices(string.ascii_lowercase, k=8))))
    elif uuid_type == 'guid':
        # Format GUID (Windows style)
        return '{' + str(uuid.uuid4()).upper() + '}'
    else:
        return str(uuid.uuid4())  # Type par défaut

def generate_bulk_uuids(uuid_type='v4', count=10):
    """
    Génère plusieurs UUIDs du type spécifié
    """
    return [generate_uuid(uuid_type) for _ in range(count)]

def generate_custom_uuid(uuid_type='v4', prefix='', suffix='', namespace=None, name=None):
    """
    Génère un UUID avec préfixe et/ou suffixe
    """
    base_uuid = generate_uuid(uuid_type, namespace, name)
    return f"{prefix}{base_uuid}{suffix}"

def get_code_snippet(uuid_value, language):
    """
    Génère un snippet de code pour différents langages
    """
    snippets = {
        'python': f"import uuid\n\nmy_uuid = uuid.UUID('{uuid_value}')",
        'javascript': f"const myUuid = '{uuid_value}';",
        'java': f"import java.util.UUID;\n\nUUID myUuid = UUID.fromString(\"{uuid_value}\");",
        'csharp': f"using System;\n\nGuid myGuid = Guid.Parse(\"{uuid_value}\");"
    }
    
    return snippets.get(language, "Code not available for this language") 

def decode_uuid(uuid_string):
    """
    Décode un UUID existant et fournit des informations détaillées
    """
    try:
        # Supprimer les accolades si elles sont présentes (format GUID)
        if uuid_string.startswith('{') and uuid_string.endswith('}'):
            uuid_string = uuid_string[1:-1]
            
        # Créer un objet UUID
        uuid_obj = uuid.UUID(uuid_string)
        
        # Extraire les informations
        result = {
            'uuid': str(uuid_obj),
            'uuid_hex': uuid_obj.hex,
            'uuid_bytes': list(uuid_obj.bytes),
            'uuid_int': uuid_obj.int,
            'uuid_variant': uuid_obj.variant,
            'uuid_version': uuid_obj.version,
            'is_valid': True,
            'fields': {
                'time_low': uuid_obj.time_low,
                'time_mid': uuid_obj.time_mid,
                'time_hi_version': uuid_obj.time_hi_version,
                'clock_seq_hi_variant': uuid_obj.clock_seq_hi_variant,
                'clock_seq_low': uuid_obj.clock_seq_low,
                'node': uuid_obj.node
            }
        }
        
        # Déterminer le type d'UUID
        if uuid_obj.version == 1:
            result['type'] = 'UUID version 1 (time-based)'
            result['timestamp'] = uuid_obj.time
        elif uuid_obj.version == 3:
            result['type'] = 'UUID version 3 (name-based with MD5)'
        elif uuid_obj.version == 4:
            result['type'] = 'UUID version 4 (random)'
        elif uuid_obj.version == 5:
            result['type'] = 'UUID version 5 (name-based with SHA-1)'
        else:
            result['type'] = f'UUID version {uuid_obj.version}'
            
        return result
    except ValueError:
        return {
            'uuid': uuid_string,
            'is_valid': False,
            'error': 'Format invalide d\'UUID'
        }
    except Exception as e:
        return {
            'uuid': uuid_string,
            'is_valid': False,
            'error': str(e)
        } 