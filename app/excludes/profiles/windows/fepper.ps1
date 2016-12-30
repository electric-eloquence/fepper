cd $PSScriptRoot

$whereNode = where.exe node

if ($whereNode -Like "*\node.exe")
{
  if (Test-Path node-v6.9.2-x64.msi)
  {
    rm node-v6.9.2-x64.msi
  }

  if (-Not (Test-Path node_modules))
  {
    echo "npm installing..."
    npm install
  }

  $argList = $args[0]
  for ($i = 1; $i -lt $args.length; $++)
  {
    $argList = "$argList $args[$i]"
  }

  node_modules\.bin\gulp --gulpfile app\tasker.js $argList
}
else
{
  iwr -o node-v6.9.2-x64.msi https://nodejs.org/dist/v6.9.2/node-v6.9.2-x64.msi
  msiexec /i node-v6.9.2-x64.msi
}

PAUSE
