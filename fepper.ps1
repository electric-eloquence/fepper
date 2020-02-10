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

$nodeVersion = "v12.15.0"
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
    npm install -g fepper-cli
    npm install
  }

  node node_modules/fepper/index.js $args
}
else
{
  iwr -OutFile $nodeMsi https://nodejs.org/dist/$nodeVersion/$nodeMsi
  msiexec /i $nodeMsiFull
  echo "Please follow the prompts to install Node.js."
}

PAUSE
