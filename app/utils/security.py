import bcrypt
import hashlib

def hash_password(password: str) -> str:
    """
    Hash a password using SHA-256 pre-hashing and bcrypt.
    SHA-256 pre-hashing ensures the password is within bcrypt's 72-byte limit.
    Using the bcrypt library directly avoids issues with passlib on modern versions.
    """
    # 1. Pre-hash to handle the 72-character limit
    # SHA-256 hex digest is 64 characters, which is 64 bytes
    pre_hash = hashlib.sha256(password.encode()).hexdigest().encode()
    
    # 2. Use bcrypt to hash that result
    return bcrypt.hashpw(pre_hash, bcrypt.gensalt()).decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against its hashed version.
    """
    # 1. Pre-hash the incoming plain password
    pre_hash = hashlib.sha256(plain_password.encode()).hexdigest().encode()
    
    # 2. Use bcrypt to verify
    return bcrypt.checkpw(pre_hash, hashed_password.encode())