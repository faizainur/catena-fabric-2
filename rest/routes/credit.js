var express = require("express");
var router = express.Router();
var crcc = require("../services/crcc");

router.get("/list", async (req, res, next) => {
  try {
    var result = await crcc.getAllAssets();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

router.get("/get", async (req, res, next) => {
  try {
    var result = await crcc.readAsset(req.query.record_id);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
});

router.post("/create", async (req, res, next) => {
  try {
    var record = {
      userUid: `${req.body.user_uid}`,
      nik: `${req.body.nik}`,
      creditType: `${req.body.credit_type}`,
      bankName: `${req.body.bank_name}`,
      amount: `${req.body.amount}`,
    };
    await crcc.createAsset(record);
    res.status(200);
    res.send("OK");
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

router.post("/reject", async (req, res) => {
  try {
    await crcc.rejectAsset(`${req.body.record_id}`);
    res.status(200);
    res.send("OK");
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

router.post("/approve", async (req, res) => {
  try {
    await crcc.approveAsset(req.body.record_id);
    res.status(200);
    res.send("OK");
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

router.post("/delete", async (req, res) => {
  try {
    result = await crcc.deleteAsset(req.body.record_id);
    res.status(200);
    res.send("OK");
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

router.get("/exist", async (req, res) => {
  try {
    result = await crcc.isExist(req.query.record_id);
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

router.post("/update", async (req, res, next) => {
  try {
    var record = {
      recordId: `${req.body.record_id}`,
      userUid: `${req.body.user_uid}`,
      nik: `${req.body.nik}`,
      creditType: `${req.body.credit_type}`,
      bankName: `${req.body.bank_name}`,
      amount: `${req.body.amount}`,
      status: `${req.body.status}`,
    };
    await crcc.updateAsset(record);
    res.status(200);
    res.send("OK");
  } catch (error) {
    res.status(500);
    res.send(error);
  }
});

router.get("/search", async (req, res) => {
  try {
    var result = await crcc.readAssetByUserUid(req.query.user_uid);
    res.send(result);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

router.get("/searchByNik", async (req, res) => {
  try {
    var result = await crcc.readAssetByNik(req.query.nik);
    res.send(result);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

router.get("/list/bank", async (req, res) => {
  try {
    var result = await crcc.readAssetByBank(req.query.name);
    res.send(result);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

module.exports = router;
