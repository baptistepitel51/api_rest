

// Variable dataBase et config 
let db, config;

// On defini les variables db et config
module.exports = (_db, _config) =>
{
        db = _db;
        config = _config;
        return user;
}

// On crée la classe user
let user = class
{
    // Méthode permettant de savoir si l'utilisateur a accès a l'entreprises passé en paramètre
    static isAutorized(idUser, idFirm)
    {       
        // On crée une promesse pour effectuer les requêtes
        return new Promise((next) => 
        {
            // Affichage dans la console des paramètres
            console.log(idUser);
            console.log(idFirm);

            // On verifie que l'utilisateur n'est pas vide
            if(idUser && idUser.trim() != '')
            {                
                // On enlève les espace sur les paramètres
                idUser = idUser.trim();
                idFirm = idFirm.trim();

                // Affichage dans la console des paramètres sans les espaces
                console.log(idUser);
                console.log(idFirm);

                // Nouvelle promesse
                // On effectue une première requêtes sql pour vérifier la présence de l'utilisateur dans la base de données
                db.query('SELECT * FROM f0001la WHERE TRIM(MSUSER) = ?', [idUser])
                .then((result) => 
                {
                    // On verifie si le resultat est différent d'undefined
                    if(result[0] != undefined)
                    {
                         // On retourne une nouvelle promesse avec une requêtes sql  qui vérifie si la compagny existe dans la base de données
                        return   db.query('SELECT * FROM f0001la WHERE ( (TRIM(MSMCUF) <= ? && TRIM(MSMCUT) >= ?) && (LENGTH(TRIM(MSMCUT)) = LENGTH(?)) )', [idFirm,idFirm, idFirm])
                    }
                    else
                    {
                        // On utilise la méthode next pour envoyer une erreur Wrong Id
                        next(new Error(config.errors.wrongId));
                    }
                })            
                .then((result) => 
                {
                    // On verifie si le resultat est différent d'undefined
                    if(result[0] != undefined)
                    {
                         // On retourne une nouvelle promesse avec une requêtes sql  qui vérifie le droit d'accès de l'utilisateur sur l'entreprise mis en paramètre
                        return   db.query('SELECT * FROM f0001la WHERE TRIM(MSUSER) = ? && ( (TRIM(MSMCUF) <= ? && TRIM(MSMCUT) >= ?) && (LENGTH(TRIM(MSMCUT)) = LENGTH(?)) )', [idUser,idFirm,idFirm, idFirm])
                    }
                    else
                    {                        
                        // On utilise la méthode next pour envoyer une erreur Wrong Id Compagny
                        next(new Error(config.errors.wrongCompagny));
                    }
                }) 
                .then((result) =>
                {
                    if(result[0] != undefined)
                    {
                        // On affiche le resultat dans la console
                        console.log(result);
                        // On utilise la méthode next pour envoyer True
                        next((true));
                    }
                    else
                    {
                        // On affiche le resultat dans la console
                        console.log(result);
                        // On utilise la méthode next pour envoyer une erreur No Access
                        next(new Error(config.errors.noAccess));
                    }
                })
                .catch((err) => next(err)) // Renvoie une erreur
            }
            else
            {
                // Renvoie une erreur si la valeur de l'utilisateur n'est pas correcte
                next(new Error(config.errors.noIdValue));
            }   
        });
    }    


    // Méthode permettant de récupérer les entreprises de l'utilisateur
    static getFirm(idUser)
    {       
         // On crée une promesse pour effectuer les requêtes
        return new Promise((next) => 
        {
             // On verifie que l'utilisateur n'est pas vide
            if(idUser && idUser.trim() != '')
            {
                // On enlève les espace sur le paramètre
                idUser = idUser.trim();

                 // Affichage dans la console du paramètre sans les espaces
                console.log(idUser);

                 // Nouvelle promesse
                // On effectue une première requêtes sql pour vérifier la présence de l'utilisateur dans la base de données
                db.query('SELECT * FROM f0001la WHERE TRIM(MSUSER) = ?', [idUser])
                    .then((result) => 
                    {
                        // On verifie si le resultat est différent d'undefined
                        if(result[0] != undefined)
                        {
                            // On retourne une nouvelle promesse avec une requêtes sql  qui permet de récupérer la liste d'entreprise de l'utilisateur
                            return   db.query('SELECT MSUSER, MSMCUF,MSMCUT FROM f0001la WHERE TRIM(MSUSER) = ?', [idUser])
                        }
                        else
                        {
                            // On utilise la méthode next pour envoyer une erreur Wrong Id
                            next(new Error(config.errors.wrongId));
                        }
                    })            
                    .then((result) => 
                    {
                        // Affichage du resultat en console
                        console.log(result);
                        // On utilise la méthode next pour envoyer le resultat
                        next((result));
                    }) 
                    .catch((err) => next(err)) // Renvoie une erreur
                }
                else
                {
                    // Renvoie une erreur si la valeur de l'utilisateur n'est pas correcte
                    next(new Error(config.errors.noIdValue));
                }   
            });
    }    

}


