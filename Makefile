install:
	! command -v go &>/dev/null && [ ! -d /tmp/go ] && echo "Starting Go compiler download and installation" && curl -sSL https://dl.google.com/go/go1.14.6.linux-amd64.tar.gz -o - | tar xzf - -C /tmp && echo "Finished installation"

server:
	go build -o bin/server ./cmd/server

start: server
	./bin/server
