const admin = require('firebase-admin'),
    firebase = require('firebase'),
    express = require('express'),
    bodyParser = require('body-parser');
const { clouddebugger } = require('googleapis/build/src/apis/clouddebugger');
const { doubleclickbidmanager } = require('googleapis/build/src/apis/doubleclickbidmanager');
router = express.Router();
router.use(bodyParser.json());
db= admin.firestore();

router.get('/new', (req,res) => {
    res.render('newEvent');

});


module.exports = router;