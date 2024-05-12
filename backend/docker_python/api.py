from flask import Flask, request, jsonify, Response
import os
import sys
import subprocess
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/exec", methods=["POST"])
def execute_code():
    code = request.get_json()["code"]
    proc = subprocess.Popen(
        [sys.executable, "./sandbox.py", code], 
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env={"PATH": os.environ.get("PATH")},
    )
    try:
        stdout, stderr = proc.communicate(timeout=2)
        output = stdout.decode()
        error = stderr.decode()
    except subprocess.TimeoutExpired:
        proc.kill()
        proc.communicate()
        output = ""
        error = "Time Limit Exceeded"

    result = {
        "output": output,
        "error": error,
        "statusCode": 200
    }

    return jsonify(result)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
