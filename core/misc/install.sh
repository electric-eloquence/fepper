#!/bin/bash
if [ ! -d extend ]; then
  cp -pR excludes/extend/ extend/;
fi
if [ ! -f conf.yml ]; then
  cp excludes/default.conf.yml conf.yml;
fi
if [ ! -f pref.yml ]; then
  cp excludes/default.pref.yml pref.yml;
fi
if [ ! -f install.log ]; then
  gulp install > install.log
fi
