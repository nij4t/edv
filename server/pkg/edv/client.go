package edv

import (
	"compress/gzip"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"strings"

	"github.com/sirupsen/logrus"
)

type Client struct {
	csrf    string
	cookies []*http.Cookie
	log     logrus.FieldLogger
}

func (c *Client) CSRF() {

	url := "https://edvgerial.az/en/login"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("accept", "text/html")
	req.Header.Add("accept-encoding", "gzip, deflate, br")
	visitHeader(&req.Header)

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()

	dec, err := gzip.NewReader(res.Body)
	if err != nil {
		log.Fatal(err)
	}

	doc, err := ioutil.ReadAll(dec)
	if err != nil {
		log.Fatal(err)
	}

	re := regexp.MustCompile(`id="_csrf" value="(.+)"`)
	c.csrf = string(re.FindSubmatch(doc)[1])
	c.cookies = res.Cookies()
}

func (c *Client) Login(mobile, pass string) string {
	c.CSRF()

	url := "https://edvgerial.az/api/v1/authentication/login"

	payload := strings.NewReader("{\"mobile\":\"" + mobile + "\",\"pin\":\"\",\"password\":\"" + pass + "\",\"loginMethod\":\"MOBILE\"}")

	req, _ := http.NewRequest("POST", url, payload)

	c.log.Debugf("payload: %s", req.Body)

	for _, c := range c.cookies {
		req.AddCookie(c)
	}
	req.Header.Add("accept-language", "en")
	req.Header.Add("xsrf-token", c.csrf)
	req.Header.Add("accept", "*/*")
	req.Header.Add("referer", "https://edvgerial.az/en/login")
	req.Header.Add("Content-Type", "application/json")
	visitHeader(&req.Header)

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	return res.Cookies()[0].Value // cookie { name: ac_session, type: jwt }
}

func New(l logrus.FieldLogger) *Client {
	return &Client{log: l}
}

func visitHeader(h *http.Header) {
	h.Add("host", "edvgerial.az")
	h.Add("connection", "keep-alive")
	h.Add("accept-encoding", "gzip, deflate, br")
	h.Add("pragma", "no-cache")
	h.Add("cache-control", "no-cache")
	h.Add("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36")
}
