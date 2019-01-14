

// Accès au fichier fonction
const {success, error, checkAndChange} = require('./assets/functions');
// Accès au module npm promise-mysql qui permet l'accès à mysql et l'accès au promesse
const mysql = require('promise-mysql');
// Accès au module npm body-parser  qui permet d'analyser le coprs des demandes entrantes (requête post etc...)
const bodyParser = require('body-parser');
// Accès au module npm Express qui est un framework pour créer l'application
const express = require('express');


//Swagger Documentation
// Accès au module npm Swagger-ui-Express
const swaggerUi = require('swagger-ui-express');
// Accès au fichier swagger de l'API
const swaggerDocument = require('./assets/swagger.json');

// Accès au module morgan qui permet d'avoir l'accès à certaines informations sur les requêtes qui permettent le debug
const morgan = require('morgan')('dev');
// On va chercher le fichier config qui possède de nombreux paramètres pour l'application tels que la bd ou le chemin
const config = require('./assets/config');

/*
    Création de la connexion à la base de données MySQL
    On va chercher les éléments de connexion dans le fichier config
 */
mysql.createConnection(
{
    host     : config.db.host,
    user     : config.db.user,
    password : config.db.password,
    database : config.db.database
}).then((db) => 
{
    // Affichage de la connexion reussis
    console.log('Connected');
    // On crée l'application avec le module express
    const app =  express();
    // On definit le swagger avec son chemin
    app.use(config.rootAPI +'api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    // On definit le header de l'api avec l'acces control 
    app.use(function(request, response, next) {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });

    // On crée un router pour les différentes routes de l'api
    let userRouter = express.Router();
    // On crée un objet user de la classe user_class
    let user = require('./assets/classes/user_class')(db,config);

    // On met en place le module morgan
    app.use(morgan);
    // On met en place le module bodyParser en JSON
    app.use(bodyParser.json()); 
    // On met en place le module bodyParser urlencoded en UTF-8
    app.use(bodyParser.urlencoded({extended :true})); 
            
    // On crée la route "/" 
    // Cette route possède une méthode post qui permet de voir si un utilisateur a accès à une certaines entreprise
    userRouter.route('/') 
        .post(async(req,res) => 
        {           
            // On appelle la méthode isAutorized qui permet de savoir si l'utilisateur a acces à l'entreprise mis en paramètre
            let isAutorized = await user.isAutorized(req.body.userId, req.body.firmId);   
            // Permet de renvoyer le resultat avec un message de succes ou d'erreur              
            res.json(checkAndChange(isAutorized));                
        });

    // On crée la route /firm
    // Cette route possède une méthode post qui permet de récupérer la liste d'entreprise d'un utilisateur
    userRouter.route('/firm')
        .post(async(req,res) => 
        {          
            // On appelle la méthode getFirm qui permet de savoir la liste d'entreprise de l'utilisateur      
            let allFirm = await user.getFirm(req.body.userId);                     
            // Permet de renvoyer le resultat avec un message de succes ou d'erreur
            res.json(checkAndChange(allFirm));                
        })        
    
    // On configure le chemin de l'api
    app.use(config.rootAPI + "user", userRouter);

    // On configure le port de l'application, puis on affiche en console le port de l'api
    app.listen(config.port, () => console.log('Started on port 8080'));
    

}).catch((err) =>
{
    // Message d'erreur lors d'un problème de connexion à la BD
    console.log('Error during database connection');
    console.log(err.message);
});


