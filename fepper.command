#!/bin/bash
DIR="$(dirname "$0")"
cd $DIR
if [[ ! -f "$DIR/conf.yml" || ! -f "$DIR/patternlab-node/config.json" ]]; then
  npm install
else
  node "$DIR/index.js" $1
fi
$SHELL
