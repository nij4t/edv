glitch-install:
	! command -v go &>/dev/null && [ ! -d /tmp/go ] && echo "Starting Go compiler download and installation" && curl -sSL https://dl.google.com/go/go1.14.6.linux-amd64.tar.gz -o - | tar xzf - -C /tmp && echo "Finished installation"

heroku-login:
	heroku login

heroku-container-login:
	heroku container:login

heroku-deploy:
	heroku container:push web
	heroku container:release web

heroku-push:
	git push heroku master

./bin/server: ./cmd/server
	go build -o ./bin/server ./cmd/server

start: ./cmd/server 
	./bin/server

cf:
	which cf 

./bin:
	mkdir ./bin

./bin/static: ./bin
	cp -r ./public ./bin/static

cf-deploy: cf ./bin/server ./bin/static
	cf push

swagger:
	GO111MODULE=off swagger generate spec -o ./swagger.yml --scan-models

clean:
	rm -rf ./bin