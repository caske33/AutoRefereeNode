REPORTER = spec
NODEARGS =

dev:
	grunt

start:
	@NODE_ENV=production grunt

mocha:
	NODE_PATH=lib ./node_modules/.bin/mocha -R $(REPORTER) -t 15000 --recursive test $(NODEARGS)

test:
	grunt test