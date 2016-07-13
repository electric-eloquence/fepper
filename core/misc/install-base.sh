#!/bin/bash
if [ ! -d patternlab-node/source ]; then
  out=`cp -v excludes/patternlab-config.json patternlab-node/`
  out=$out$'\n'`cp -pRv excludes/profiles/base/source/ patternlab-node/source/`
  echo "$out" > install.log
fi
npm install
gulp data
