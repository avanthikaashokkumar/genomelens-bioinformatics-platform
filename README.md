cd /Users/avanthikaashokkumar/Documents/Avanthika

python3 <<'PY'
from pathlib import Path
import re
import shutil

readme = Path("README.md")
backup = Path("README.md.backup")

if not readme.exists():
    raise SystemExit("README.md was not found. Make sure you are in the project folder.")

shutil.copy2(readme, backup)

text = readme.read_text(encoding="utf-8")
lines = text.splitlines()

markdown_image = re.compile(r'!\[[^\]]*\]\(([^)]+)\)')
html_image = re.compile(r'<img\b[^>]*\bsrc=["\']([^"\']+)["\'][^>]*>', re.IGNORECASE)

def is_missing_local_image(reference):
    reference = reference.strip().split()[0].strip('"\'')
    reference = reference.split("#")[0].split("?")[0]

    if reference.startswith(("http://", "https://", "data:")):
        return False

    return not Path(reference).exists()

cleaned = []
removed = []

for line in lines:
    references = markdown_image.findall(line) + html_image.findall(line)

    if references and any(is_missing_local_image(ref) for ref in references):
        removed.append(line.strip())
        continue

    cleaned.append(line)

result = "\n".join(cleaned)

# Remove empty HTML containers left behind after removing image tags.
result = re.sub(
    r'<(?:div|p)[^>]*>\s*</(?:div|p)>',
    '',
    result,
    flags=re.IGNORECASE | re.DOTALL
)

# Remove excessive blank lines.
result = re.sub(r'\n{3,}', '\n\n', result).strip() + "\n"

readme.write_text(result, encoding="utf-8")

print(f"Removed {len(removed)} broken image line(s).")
print("Backup created as README.md.backup")
PY

git diff README.md
git add README.md
git commit -m "docs: remove broken README screenshot placeholders"
git push
