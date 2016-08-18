#!/bin/bash
if [ ! -d extend ]; then
  cp -pR app/excludes/extend/ extend/;
fi
if [ ! -f conf.yml ]; then
  cp app/excludes/default.conf.yml conf.yml;
fi
if [ ! -f pref.yml ]; then
  cp app/excludes/default.pref.yml pref.yml;
fi
if [ ! -f patternlab-config.json ]; then
  cp app/excludes/patternlab-config.json patternlab-config.json;
fi
if [ ! -f install.log ]; then
  ./node_modules/.bin/gulp --gulpfile ./app/tasker.js install > install.log
fi
