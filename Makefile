build:
	tsc

deploy:
	cp style.css index.html dist/
	cp -r data dist/

clean:
	rm -rf dist/*
