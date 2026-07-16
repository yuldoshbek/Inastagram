$gitPath = "C:\Program Files\Git\cmd\git.exe"

& $gitPath add .
& $gitPath commit -m "Fix TS imports for verbatimModuleSyntax and CSS import order"
& $gitPath push
