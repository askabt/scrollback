#!/bin/sh

cd client/sdk

echo "(function(){" > ../client.js

cat ../../

cat addEvent.js addStyle.js domReady.js getByClass.js jsonml2.js polyfill.js ui.js net.js >> ../client.js

echo "}())" >> ../client.js

# cd ../

# uglifyjs2 -m -c -o ../client.min.js client.js