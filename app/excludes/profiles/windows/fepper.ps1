cd $PSScriptRoot

$whereNode = where.exe node

if ($whereNode -Like "*\node.exe")
{
  if (Test-Path node-v6.9.2-x64.msi)
  {
    rm node-v6.9.2-x64.msi
  }

  if (
    -Not (Test-Path conf.yml) -or
    -Not (Test-Path extend) -or
    -Not (Test-Path node_modules) -or
    -Not (Test-Path patternlab-config.json) -or
    -Not (Test-Path pref.yml))
  {
    if (-Not (Test-Path conf.yml))
    {
      cp app\excludes\conf.yml .
    }

    if (-Not (Test-Path extend))
    {
      cp -Recurse app\excludes\extend .
    }

    if (-Not (Test-Path node_modules))
    {
      echo "npm installing..."
      npm install
    }

    if (-Not (Test-Path patternlab-config.json))
    {
      cp app\excludes\patternlab-config.json .
      if (-Not (Test-Path source))
      {
        cp -Recurse app\excludes\profiles\main\source .
      }
    }

    if (-Not (Test-Path pref.yml))
    {
      cp app\excludes\pref.yml .
    }
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
