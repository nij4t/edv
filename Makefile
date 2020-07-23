glitch-install:
	! command -v go &>/dev/null && [ ! -d /tmp/go ] && echo "Starting Go compiler download and installation" && curl -sSL https://dl.google.com/go/go1.14.6.linux-amd64.tar.gz -o - | tar xzf - -C /tmp && echo "Finished installation"

glitch-build: glitch-install
	go build -o bin/server ./cmd/server

glitch-start: server
	./bin/server


heroku-login:
	heroku login

heroku-container-login:
	heroku container:login

heroku-deploy:
	heroku container:push web
	heroku container:release web

heroku-push:
	git push heroku master

cf:
	which cf || "IBM CloudFoundry cli is not installed"

cf-deply: cf
	cf push

swagger:
	GO111MODULE=off swagger generate spec -o ./swagger.yml --scan-models
