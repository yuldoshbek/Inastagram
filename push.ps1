$gitPath = "C:\Program Files\Git\cmd\git.exe"

& $gitPath init
& $gitPath add .
& $gitPath commit -m "first commit"
& $gitPath branch -M main
& $gitPath remote add origin https://github.com/yuldoshbek/Inastagram.git
& $gitPath push -u origin main
