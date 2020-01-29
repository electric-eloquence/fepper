Dim argsList
Dim cwd
Dim fso
Dim nodeModulesPath
Dim objArgs
Dim objShell
Dim ps1Path
Dim verb

Set fso = CreateObject("Scripting.FileSystemObject")
Set objArgs = Wscript.Arguments
Set objShell = CreateObject("Shell.Application")
cwd = fso.GetAbsolutePathName(".")
nodeModulesPath = fso.BuildPath(cwd, "node_modules")
ps1Path = fso.BuildPath(cwd, "fepper.ps1")

argsList = ""
For Each strArg in objArgs
  argsList = argsList & " " & strArg
Next

If fso.FolderExists(nodeModulesPath) Then
  verb = ""
Else
  verb = "runas"
End If

objShell.ShellExecute "powershell", "-ExecutionPolicy Bypass -File " & ps1Path & argsList, cwd, verb, 1
