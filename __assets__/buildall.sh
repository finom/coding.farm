#!/usr/bin/env bash
echo "Start All"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
./mkdoc.sh

cd ../../matreshka
npm i & grunt

cd ../finom.github.io
cp ../matreshka/matreshka.min.js js
cp ../matreshka/matreshka.js ../todomvc/labs/architecture-examples/matreshka/bower_components/matreshka/
docco ../todomvc/labs/architecture-examples/matreshka/js/*.js --output ../todomvc/labs/architecture-examples/matreshka/docs/
docco ../todomvc/labs/architecture-examples/matreshka/ru/js/*.js --output ../todomvc/labs/architecture-examples/matreshka/ru/docs/
rm -r matreshka/todo/
cp -r ../todomvc/labs/architecture-examples/matreshka/ ./matreshka/todo/

echo "Start Jekyll"
jekyll build
echo "Done Jekyll"



echo "Done All"