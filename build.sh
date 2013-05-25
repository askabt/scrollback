#!/bin/sh

cd client/sdk

cat socket.io.js > ../client.js
echo "(function(){" >> ../client.js
cat addEvent.js addStyle.js domReady.js getByClass.js jsonml2.js polyfill.js ui.js css.js net.js >> ../client.js
echo "}())" >> ../client.js

cd ../

uglifyjs -m -c -o client.min.js client.js