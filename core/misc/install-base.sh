#!/bin/bash
if [ ! -d ui/source ]; then
  out=`cp -v excludes/patternlab-config.json ui/`
  out=$out$'\n'`cp -pRv excludes/profiles/base/source/ ui/source/`
  echo "$out" > install.log
fi
npm install
./node_modules/.bin/gulp --gulpfile tasker.js data
