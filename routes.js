const express = require('express');
const route = express.Router();


//ROTAS DA HOME
const homeController = require('./src/controllers/homeController');
route.get('/', homeController.homePage);
route.post('/', homeController.homePost);

//ROTAS DE CONTATO
const contactController = require('./src/controllers/contactController');
route.get('/contact', contactController.contactPage);



module.exports = route;