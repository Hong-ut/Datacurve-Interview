import os
import json
import io
import sys
import builtins
import signal
import resource
import pyseccomp as seccomp


MEMORY_LIMIT = 64 * 1024 * 1024  # 64kb
CPU_TIME_LIMIT = 3  # 1sec
WRITE_LIMIT = 512  # 512bytes


def drop_perms():
    filter = seccomp.SyscallFilter(seccomp.ERRNO(seccomp.errno.EPERM))

    filter.add_rule(
        seccomp.ALLOW, "write", seccomp.Arg(0, seccomp.EQ, sys.stdout.fileno())
    )
    filter.add_rule(
        seccomp.ALLOW, "write", seccomp.Arg(0, seccomp.EQ, sys.stderr.fileno())
    )

    filter.load()


def set_mem_limit():
    resource.setrlimit(resource.RLIMIT_AS, (MEMORY_LIMIT, MEMORY_LIMIT))
    resource.setrlimit(resource.RLIMIT_CPU, (CPU_TIME_LIMIT, CPU_TIME_LIMIT))
    resource.setrlimit(resource.RLIMIT_FSIZE, (WRITE_LIMIT, WRITE_LIMIT))


def restricted_open(*args, **kwargs):
    raise PermissionError("File access is restricted")

def restricted_os_methods(*args, **kwargs):
    raise PermissionError("Operation not permitted")

class TimeoutException(Exception):
    pass

def handle_timeout(signum, frame):
    raise TimeoutException("Code execution timed out")

def exec_python(code, timeout=5):
    os.environ.clear()
    
    builtins.open = restricted_open
    original_remove = os.remove
    original_rmdir = os.rmdir
    original_rename = os.rename
    original_unlink = os.unlink
    os.remove = restricted_os_methods
    os.rmdir = restricted_os_methods
    os.rename = restricted_os_methods
    os.unlink = restricted_os_methods
    os.getenv = restricted_os_methods

    og_stdout = sys.stdout
    sys.stdout = output_capture = io.StringIO()


    try:
        drop_perms()
        set_mem_limit()
        exec(code)
        output = output_capture.getvalue()
        return json.dumps({'output': output, 'error': False})
    except TimeoutException as e:
        return json.dumps({'output': str(e), 'error': True})
    except Exception as e:
        return json.dumps({'output': str(e), 'error': True})
    finally:
        sys.stdout = og_stdout
        builtins.open = open
        os.remove = original_remove
        os.rmdir = original_rmdir
        os.rename = original_rename
        os.unlink = original_unlink
        signal.alarm(0) 

def handler(code, context):
    if not code:
        return {
            'output': '',
            'error': 'No code provided',
            'statusCode': 400
        }
    result = json.loads(exec_python(code))
    return {
        'output': result['output'],
        'error': result['error'],
        'statusCode': 200
    }

