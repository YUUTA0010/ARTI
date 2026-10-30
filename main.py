import os
import shutil
import subprocess
import sys
from pathlib import Path


def main():
    project_dir = Path(__file__).resolve().parent
    os.chdir(project_dir)

    npm_cmd = shutil.which("npm")
    if not npm_cmd:
        print("Error: npm is not installed or not available in PATH.")
        print("Install Node.js from https://nodejs.org/ and try again.")
        sys.exit(1)

    if not (project_dir / "node_modules").exists():
        print("Installing dependencies...")
        result = subprocess.run([npm_cmd, "install"], cwd=project_dir)
        if result.returncode != 0:
            print("Dependency installation failed.")
            sys.exit(result.returncode)

    print("Starting the website...")
    print("Open: http://localhost:3000")
    subprocess.run([npm_cmd, "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"], cwd=project_dir)


if __name__ == "__main__":
    main()
