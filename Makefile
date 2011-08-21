all:
	npm install -d

mongo:
	/usr/local/mongodb/bin/mongod --dbpath=./db

jslint:
	PYTHONPATH=tools/closure_linter/ /usr/bin/python tools/closure_linter/closure_linter/gjslint.py --unix_mode --strict --nojsdoc -r node/

clean:
	-rm *~ *.*~

