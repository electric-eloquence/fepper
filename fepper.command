#!/bin/bash

# cd to working environment. Necessary when double-clicking from Finder.
root_dir=$(dirname $0)
cd $root_dir

# Check if Node.js is installed. Install if it isn't.
has_node=`which node`
node_version="v12.15.0"
node_pkg="node-${node_version}.pkg"

if [[ $has_node != *bin/node ]]; then
  curl -O https://nodejs.org/dist/${node_version}/${node_pkg}
  sudo installer -pkg $node_pkg -target /
  sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
fi

# Delete installer file.
if [ -f $node_pkg ]; then
  rm $node_pkg
fi

# Check if fepper-cli is installed. Install if it isn't.
has_fp=`which fp`

if [[ $has_fp != *bin/fp ]]; then
  npm install -g fepper-cli

  if [[ $? != 0 ]]; then
    echo
    echo Running this command again as root/Administrator...
    sudo npm install -g fepper-cli
  fi
fi

# Check for mandatory files and dirs. Run installer if missing.
if [[
  ! -f ${root_dir}/conf.yml ||
  ! -d ${root_dir}/node_modules ||
  ! -f ${root_dir}/patternlab-config.json
  ]]; then
  npm install
fi

node node_modules/fepper/index.js

# Open a shell for this script's process.
$SHELL
