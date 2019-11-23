var express = require('express');
var router = express.Router();
var personajeController = require('../controllers/personajeController');

router.get('/', (req , res)=>{
  res.render('CRUD');
});

router.post('/registrar', personajeController.register);

router.get('/:nombre', personajeController.getOne);

router.get('/showall', personajeController.getAll);



module.exports = router;
