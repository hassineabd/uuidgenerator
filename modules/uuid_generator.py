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