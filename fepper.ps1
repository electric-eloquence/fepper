cd $PSScriptRoot

$OSArchitecture = (Get-WmiObject Win32_OperatingSystem).OSArchitecture

if ($OSArchitecture -eq "32-bit")
{
  $archMsi = "x86.msi"
}
else
{
  $archMsi = "x64.msi"
}

$nodeVersion = "v8.11.4"
$nodeMsi = "node-" + $nodeVersion + "-" + $archMsi
$nodeMsiFull = $PSScriptRoot + "\" + $nodeMsi
$whereNode = where.exe node

if ($whereNode -Like "*\node.exe")
{
  if (Test-Path $nodeMsi)
  {
    rm $nodeMsi
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

  node_modules\.bin\gulp --gulpfile node_modules\fepper\tasker.js $argList
}
else
{
  iwr -OutFile $nodeMsi https://nodejs.org/dist/$nodeVersion/$nodeMsi
  msiexec /i $nodeMsiFull
  echo "Please follow the prompts to install Node.js."
}

PAUSE
