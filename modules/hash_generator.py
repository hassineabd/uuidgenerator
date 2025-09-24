import hashlib

def generate_hash(data, hash_type='md5'):
    """
    Génère un hash à partir des données fournies
    """
    hash_functions = {
        'md5': hashlib.md5,
        'sha1': hashlib.sha1,
        'sha256': hashlib.sha256,
        'sha512': hashlib.sha512
    }
    
    if hash_type in hash_functions:
        hash_func = hash_functions[hash_type]
        return hash_func(data.encode()).hexdigest()
    else:
        # Type de hash par défaut
        return hashlib.md5(data.encode()).hexdigest() 