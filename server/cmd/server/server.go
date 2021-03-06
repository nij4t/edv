package main

import (
	"net/http"
	"os"

	"github.com/nij4t/edv/pkg/api/v1alpha1"
	"github.com/nij4t/edv/pkg/edv"
	"github.com/sirupsen/logrus"
)

func main() {

	logger := logrus.New()
	logger.SetLevel(logrus.DebugLevel)

	c := edv.New(logger)

	h := v1alpha1.New(c, logger)

	mux := http.NewServeMux()
	h.Handler(mux)

	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("PONG"))
	})

	addr := os.Getenv("EDV_ADDR")
	if addr == "" {
		addr = ":8080"
	}

	logger.Infof("server starting on %s\n", addr)
	logger.Fatal(http.ListenAndServe(addr, mux))
}
