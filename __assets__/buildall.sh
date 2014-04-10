#!/usr/bin/env bash
echo "Start All"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
./mkdoc.sh

cd ../../matreshka
npm i & grunt

cd ../finom.github.io
cp ../matreshka/build/*.js js

echo "Start Jekyll"
jekyll build
echo "Done Jekyll"

echo "Done All"