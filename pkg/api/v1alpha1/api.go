package v1alpha1

import (
	"encoding/json"
	"net/http"

	"github.com/sirupsen/logrus"
)

type edvclient interface {
	Login(mobile, password string) (accessToken string)
}

type Handler struct {
	c edvclient
	l logrus.FieldLogger
}

type LoginRequest struct {
	Mobile   string `json:"mobile"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

// Handler bounds urls to handle func
func (s *Handler) Handler(mux *http.ServeMux) {
	mux.HandleFunc("/api/v1alpha1/login", s.Logger(s.Login))
}

func (s *Handler) Login(w http.ResponseWriter, r *http.Request) {

	dec := json.NewDecoder(r.Body)
	defer r.Body.Close()
	creds := &LoginRequest{}
	err := dec.Decode(creds)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("invalid input data"))
	}
	s.l.Debugf("creds: %s", creds)
	token := s.c.Login(creds.Mobile, creds.Password)

	w.WriteHeader(http.StatusOK)
	enc := json.NewEncoder(w)
	payload := &LoginResponse{Token: token}
	enc.Encode(payload)
	return
}

func New(client edvclient, logger logrus.FieldLogger) *Handler {
	return &Handler{c: client, l: logger}
}
