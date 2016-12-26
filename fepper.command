#!/bin/bash

# cd to working environment. Necessary when double-clicking from Finder.
root_dir=$(dirname $0)
cd $root_dir

# Check if Node is installed. Install if it isn't.
has_node=`which node`
if [[ $has_node != *bin/node ]]; then
  curl -O https://nodejs.org/dist/v6.9.2/node-v6.9.2.pkg
  sudo installer -pkg node-v6.9.2.pkg -target /
  rm node-v6.9.2.pkg
  sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
fi

# Check for fepper-cli. Install if missing.
has_fp=`which fp`
if [[ $has_fp != *bin/fp ]]; then
  npm install -g fepper-cli
fi

# Check for mandatory files and dirs. Run installer if missing.
if [[
  ! -f ${root_dir}/conf.yml ||
  ! -d ${root_dir}/node_modules ||
  ! -f ${root_dir}/patternlab-config.json
  ]]; then
  npm install
fi

fp

# Open a shell for this script's process.
$SHELL
