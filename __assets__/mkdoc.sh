#!/usr/bin/env bash
echo "Start JSDoc"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
sh ./jsdoc/jsdoc \
../../matreshka/src/xclass.js \
../../matreshka/src/matreshka-core.js \
../../matreshka/src/matreshka-binders.js \
../../matreshka/src/matreshka-array.js \
../../matreshka/src/matreshka-object.js \
../../matreshka/src/balalaika.js \
../../matreshka/src/balalaika-extended.js \
../../matreshka/README.md -d ../matreshka/docs/ -t jsdoc/templates/matreshka
echo "Done JSDoc"