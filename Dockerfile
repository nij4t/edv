FROM golang:1.13-alpine AS build-env

# Allow Go to retrive the dependencies for the build step
RUN apk add --no-cache git

# Secure against running as root
RUN adduser -D -u 10000 nij4t
RUN mkdir /app && chown nij4t /app/
USER nij4t

WORKDIR /app/
ADD . /app/

RUN go get -u ./...
# Compile the binary, we don't want to run the cgo resolver
RUN CGO_ENABLED=0 go build -o /app/server ./cmd/server

# final stage
FROM scratch

COPY --from=build-env /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=build-env /app/server /

EXPOSE 8080

CMD ["/server"]