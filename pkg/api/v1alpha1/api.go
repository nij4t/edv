// Package classification EDVGeriAlAPI
//
// This api provides a cashback service from EDV Geri Al
//
// Terms Of Service:
//
// there are no TOS at this moment, use at your own risk we take no responsibility
//
//     Schemes: http, https
//     BasePath: /api/v1alpha1
//     Version: 0.0.1
//     License: MIT https://github.com/nij4t/edv/blob/master/LICENSE
//     Contact: Nijat Mahmudov<n.e.mahmudov@gmail.com>
//
//     Consumes:
//     - application/json
//
//     Produces:
//     - application/json
//
// swagger:meta
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

// LoginRequest is a request schema used for marshaling authentication
// swagger:parameters login
type LoginRequest struct {
	// in: body
	Body struct {
		// User's phone number
		// required: true
		Mobile string `json:"mobile"`
		// User's Password
		// required: true
		Password string `json:"password"`
	}
}

// LoginResponse is a response schema used when user provides correct credetials
// swagger:response loginResponse
type LoginResponse struct {
	// in: body
	Body struct {
		// Access Token
		// required: true
		Token string `json:"token"`
	}
}

// Handler bounds urls to handle func
func (s *Handler) Handler(mux *http.ServeMux) {
	mux.HandleFunc("/api/v1alpha1/login", s.Logger(s.Login))
}

// swagger:route POST /login login
//
// Authenticates user and returns JWT access token
//
// Responses:
//   200: loginResponse
//
func (s *Handler) Login(w http.ResponseWriter, r *http.Request) {
	dec := json.NewDecoder(r.Body)
	defer r.Body.Close()
	creds := &LoginRequest{}
	err := dec.Decode(&creds.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("invalid input data"))
	}
	s.l.Debugf("creds: %s", creds)
	token := s.c.Login(creds.Body.Mobile, creds.Body.Password)

	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusOK)
	enc := json.NewEncoder(w)
	// payload := &LoginResponse{Token: token}
	payload := &LoginResponse{}
	payload.Body.Token = token
	enc.Encode(payload)
	return
}

func New(client edvclient, logger logrus.FieldLogger) *Handler {
	return &Handler{c: client, l: logger}
}
