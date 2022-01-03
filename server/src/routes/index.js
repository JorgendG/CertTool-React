const express = require("express");
const router = express.Router();
const controller = require("../controller/file.controller");

let routes = (app) => {
  router.post("/upload", controller.upload);
  router.get("/files", controller.getListFiles);
  router.get("/files/:name", controller.download);

  router.get("/", controller.getRoot);
  router.get("/api/csr", controller.getCSRs);
  router.get("/api/cert", controller.getCertificate);
  router.get("/api/certs", controller.getCerts);
  router.get('/api/certs/:dirname/:filename', controller.getFile);

  router.post("/api/certs", controller.newCSR);

  app.use(router);
};

module.exports = routes;
