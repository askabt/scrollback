#!/bin/sh

cd client/sdk

uglifyjs2 -m -c -o ../client.js addEvent.js addStyle.js domReady.js getByClass.js jsonml2.js ui.js net.js
