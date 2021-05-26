var express = require('express');
var router = express.Router();
var upcc = require('../services/upcc')
var authService = require('../services/auth')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/list', async (req, res, next) => {
  try {
   var result =  await upcc.getAllAssets()
   res.send(result)
  } catch (error) {
    res.send(error)
  }
})

router.get('/get', authService.validateJwt, async (req, res, next) => {
  try {
    var result = await upcc.readAsset(req.query.user_uid)
    res.send(result)
  } catch (error) {
    res.status(500);
    res.send(error.message)
  }
})

router.get('/bank/get', authService.introspectToken, async (req, res, next) => {
  try {
    var userUid = `${req.query.user_uid}`
    if (userUid === '' || userUid === "undefined") {
      res.status(400)
      res.send('Bad Request')
    } else {
      var result = await upcc.readAsset(userUid)
      res.send(result)
    }
  } catch (error) {
    res.status(500);
    res.send(error.message)
  }
})

router.post('/register', authService.validateJwt, async (req, res, next) => {
  try {
    
    var user = {
      userUid: `${req.body.user_uid}`, 
      firstName: `${req.body.first_name}`,
      lastName: `${req.body.last_name}`,
      addressLine1: `${req.body.address_line_1}`,
      addressLine2: `${req.body.address_line_2}`,
      city: `${req.body.city}`,
      province: `${req.body.province}`,
      postalCode: `${req.body.postal_code}`,
      ttl: `${req.body.ttl}`,
      nik: `${req.body.nik}`,
      idCard:`${req.body.id_card}`,
      businessLicense: `${req.body.business_license}`
    };
    await upcc.createAsset(user)
    res.status(200)
    res.send('OK')
  } catch (error) {
    res.status(400);
    res.send(error)
  }
})

router.post('/delete', async (req, res) => {
  try {
    result = await upcc.deleteAsset(req.body.user_uid)
    res.status(200)
    res.send(result)
  } catch (error) {
    res.status(400)
    res.send(error)
  }
})

router.get('/exist', async (req, res) => {
  try {
    result = await upcc.isExist(req.query.user_uid)
    console.log(`${result}`)
    res.send(result)
  } catch (error) {
    res.send(error)
  }
})

router.post('/update',authService.validateJwt,  async (req, res, next) => {
  try {
    
    var user = {
      userUid: `${req.body.user_uid}`, 
      firstName: `${req.body.first_name}`,
      lastName: `${req.body.last_name}`,
      addressLine1: `${req.body.address_line_1}`,
      addressLine2: `${req.body.address_line_2}`,
      city: `${req.body.city}`,
      province: `${req.body.province}`,
      postalCode: `${req.body.postal_code}`,
      ttl: `${req.body.ttl}`,
      nik: `${req.body.nik}`,
      idCard:`${req.body.id_card}`,
      businessLicense: `${req.body.business_license}`
    };
    await upcc.updateAsset(user)
    res.status(200)
    res.send('OK')
  } catch (error) {
    res.status(500);
    res.send(error)
  }
})

module.exports = router;
