Dim argsList
Dim cwd
Dim fso
Dim objArgs
Dim objShell
Dim ps1Path

Set fso = CreateObject("Scripting.FileSystemObject")
Set objArgs = Wscript.Arguments
Set objShell = CreateObject("Shell.Application")
cwd = fso.GetAbsolutePathName(".")
ps1Path = fso.BuildPath(cwd, "fepper.ps1")

argsList = ""
For Each strArg in objArgs
  argsList = argsList & " " & strArg
Next

objShell.ShellExecute "powershell", "-ExecutionPolicy Bypass -File " & ps1Path & argsList, cwd, "", 1
