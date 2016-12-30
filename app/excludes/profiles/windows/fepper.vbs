Dim argsList
Dim cwd
Dim fso
Dim objArgs
Dim objShell
Dim pathFull

Set fso = CreateObject("Scripting.FileSystemObject")
Set objArgs = Wscript.Arguments
Set objShell = CreateObject("Wscript.shell")
cwd = fso.GetAbsolutePathName(".")
pathFull = fso.BuildPath(cwd, "fepper.ps1")

argsList = ""
For Each strArg in objArgs
  argsList = argsList & " " & strArg
Next

objShell.run("powershell -executionpolicy bypass -file " & pathFull & argsList)
