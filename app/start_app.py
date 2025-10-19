import os
import subprocess
import time
import requests

def is_ollama_running():
    """Check if Ollama server is active"""
    try:
        response = requests.get("http://127.0.0.1:11434/api/tags", timeout=2)
        return response.status_code == 200
    except Exception:
        return False


def start_ollama_server():
    """Start Ollama server with GPU-optimized environment vars"""
    print("🚀 Starting Ollama server with optimized settings...")

    env = os.environ.copy()
    env["OLLAMA_NUM_PARALLEL"] = "1"
    env["OLLAMA_KV_CACHE_TYPE"] = "cpu"
    env["OLLAMA_FLASH_ATTENTION"] = "false"
    env["OLLAMA_LOAD_TIMEOUT"] = "10m"
    env["OLLAMA_KEEP_ALIVE"] = "10m"
    env["OLLAMA_NOHISTORY"] = "true"

    # Start Ollama in background
    subprocess.Popen(
        ["ollama", "serve"],
        env=env,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    # Wait until Ollama responds
    for _ in range(30):  # wait up to ~30 seconds
        if is_ollama_running():
            print("✅ Ollama server is up and running on port 11434")
            return True
        time.sleep(1)

    print("❌ Failed to start Ollama server.")
    return False


if __name__ == "__main__":
    if not is_ollama_running():
        started = start_ollama_server()
        if not started:
            exit(1)
    else:
        print("✅ Ollama server already running.")
