test:
	node_modules/mocha/bin/mocha tests/basictests.js

test-inspector:
	node-inspector &
	node_modules/mocha/bin/mocha --debug-brk tests/basictests.js -t 120000 &
	open http://127.0.0.1:8080/debug?port=5858
