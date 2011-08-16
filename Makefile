all:
	npm install -d

mongo:
	/usr/local/mongodb/bin/mongod --dbpath=./mongodb_data

clean:
	-rm *~ *.*~

