$gitPath = "C:\Program Files\Git\cmd\git.exe"

& $gitPath config --global user.name "Yuldoshbek"
& $gitPath config --global user.email "yuldoshbek@example.com"
& $gitPath commit -m "first commit"
& $gitPath branch -M main
& $gitPath push -u origin main
