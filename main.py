import os
import shutil
import subprocess
import sys
from pathlib import Path
from urllib.request import urlopen


def main():
    project_dir = Path(__file__).resolve().parent
    os.chdir(project_dir)

    try:
        with urlopen("http://localhost:3000", timeout=2) as response:
            if response.headers.get("X-Powered-By") == "Next.js":
                print("The website is already running at http://localhost:3000")
                return
    except OSError:
        pass

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
    print("Open the Local URL printed by Next.js below.")
    result = subprocess.run(
        [npm_cmd, "run", "dev", "--", "--hostname", "0.0.0.0"],
        cwd=project_dir,
    )
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
