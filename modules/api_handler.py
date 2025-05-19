from .uuid_generator import generate_uuid, generate_bulk_uuids

def api_generate_uuid(uuid_type='v4', count=1):
    """
    Fonction pour l'API de génération d'UUID
    """
    if count <= 1:
        return {
            "success": True,
            "uuid": generate_uuid(uuid_type)
        }
    else:
        return {
            "success": True,
            "count": count,
            "uuids": generate_bulk_uuids(uuid_type, count)
        } 