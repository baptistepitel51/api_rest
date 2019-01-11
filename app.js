//Accès Bibliothèque

//const os = require('os');
//const fs = require('fs');
//const http = require('http');


const {success, error, checkAndChange} = require('./assets/functions');
const mysql = require('promise-mysql');
const bodyParser = require('body-parser');
const express = require('express');


//Swagger Documentation
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./assets/swagger.json');

const morgan = require('morgan')('dev');
const config = require('./assets/config');

mysql.createConnection(
{
    host     : config.db.host,
    user     : config.db.user,
    password : config.db.password,
    database : config.db.database
}).then((db) => 
{
    console.log('Connected');

    const app =  express();

    app.use(config.rootAPI +'/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



    let userRouter = express.Router();
    let user = require('./assets/classes/user_class')(db,config);

    app.use(morgan);
    app.use(bodyParser.json()); 
    app.use(bodyParser.urlencoded({extended :true})); 
                   
    userRouter.route('/') 
            .post(async(req,res) => 
            {               
                let isAuorized = await user.isAutorized(req.body.id, req.body.firm);                     
                res.json(checkAndChange(isAuorized));                
            });


        userRouter.route('/firm')
            .post(async(req,res) => 
            {                
               let allFirm = await user.getFirm(req.body.id);                     
                res.json(checkAndChange(allFirm));                
            })
        
    
        app.use(config.rootAPI, userRouter);

        app.listen(config.port, () => console.log('Started on port 8080'));
    

}).catch((err) =>
{
    console.log('Error during database connection');
    console.log(err.message);
});


