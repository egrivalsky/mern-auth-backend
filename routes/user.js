const router = require('express').Router();
const ctrl = require('../controllers');

router.get('/test', ctrl.user.test);

module.exports = router;