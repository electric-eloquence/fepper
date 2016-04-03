#!/bin/bash

# cd to working environment.
root_dir=$(dirname $0)
cd $root_dir

# Run installer or default task.
if [[ ! -f ${root_dir}/conf.yml || ! -f ${root_dir}/patternlab-node/config.json ]]; then
  npm install
else
  node ${root_dir}/index.js
fi

# Open a shell for this script's process.
$SHELL
