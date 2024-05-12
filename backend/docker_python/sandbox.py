import sys
import resource
import pyseccomp as seccomp


MEMORY_LIMIT = 64 * 1024 * 1024  # 64kb
CPU_TIME_LIMIT = 3  # 1sec
WRITE_LIMIT = 512  # 512bytes


def drop_user_permissions():
    # user can't access sensitive files (ex: Dockerfile)
    filter = seccomp.SyscallFilter(seccomp.ERRNO(seccomp.errno.EPERM))
    filter.add_rule(
        seccomp.ALLOW, "write", seccomp.Arg(0, seccomp.EQ, sys.stdout.fileno())
    )
    filter.add_rule(
        seccomp.ALLOW, "write", seccomp.Arg(0, seccomp.EQ, sys.stderr.fileno())
    )
    filter.load()


def set_mememory_limit():
    # v memory
    resource.setrlimit(resource.RLIMIT_AS, (MEMORY_LIMIT, MEMORY_LIMIT))
    # cpu timelimit
    resource.setrlimit(resource.RLIMIT_CPU, (CPU_TIME_LIMIT, CPU_TIME_LIMIT))
    # user code size limit 
    resource.setrlimit(resource.RLIMIT_FSIZE, (WRITE_LIMIT, WRITE_LIMIT))

def execute_python_code(code):
    set_mememory_limit()
    drop_user_permissions()
    exec(code)


if __name__ == "__main__":
    code = sys.argv[1]
    execute_python_code(code)
