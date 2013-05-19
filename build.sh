#!/bin/sh

cd ~/askabt/www/js/sdk

uglifyjs2 -m -c -o ../client.js addEvent.js addStyle.js domReady.js getByClass.js jsonml2.js request.js sdk.js
