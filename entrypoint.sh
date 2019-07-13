#!/bin/bash
if [-z "$production"]
then
	node server.js
else
	rm -r node_modules
	npm i
	node server.js
fi
