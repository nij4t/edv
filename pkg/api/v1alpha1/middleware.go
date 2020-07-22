package v1alpha1

import (
	"net/http"
	"time"
)

// Logger is a middleware that writes logging info for every request
func (s *Handler) Logger(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		startTime := time.Now()
		s.l.Println(r.URL.RequestURI(), r.UserAgent())
		defer s.l.Infof("request processed in %s\n", time.Now().Sub(startTime))
		next(w, r)
	}
}
