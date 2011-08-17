all:
	npm install -d

mongo:
	/usr/local/mongodb/bin/mongod --dbpath=./db

clean:
	-rm *~ *.*~

