const { Configuration, AdminApi } = require("@ory/hydra-client");
var express = require("express");
const axios = require('axios').default;
const fetch = require("node-fetch");


const hydraAdmin = new AdminApi(
  new Configuration({
    basePath: "https://hydra.catena.id/admin",
  })
);

exports.introspectToken = (req, res, next) => {
    getAuthToken(req, res, () => {
        if (req.authToken !== null ){
            hydraAdmin
                .introspectOAuth2Token(req.authToken)
                .then((data) => {
                var isActive = data.data.active;
                if (isActive) {
                    next();
                } else {
                    res.status(401);
                    res.send("Unauthorized");
                }
                })
                .catch((error) => res.send(error));
        } else {
            res.status(401);
            res.send("Unauthorized");
        }
    })
};

var getAuthToken = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    req.authToken = req.headers.authorization.split(" ")[1];
  } else {
    req.authToken = null;
  }
  next();
};

exports.validateJwt = (req, res, next) => {
    getAuthToken(req, res, async () => {
        if (req.authToken !== null ){
            var token = 'Bearer ' + req.authToken
            var url = 'https://api.catena.id/v1/auth/validate_token'
            fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': token
                }
            }).then((response) => response.json())
            .then((json) => {
                if (json.is_valid) {
                    next()
                } else {
                    res.status(401);
                    res.send("Unauthorized");
                }
            })
            .catch((error) => res.send())
        } else {
            res.status(401);
            res.send("Unauthorized");
        }
    })
};
