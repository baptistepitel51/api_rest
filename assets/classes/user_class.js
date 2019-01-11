
let db, config;

module.exports = (_db, _config) =>
{
        db = _db;
        config = _config;
        return user;
}

let user = class
{
    // Méthode permettant de savoir si l'utilisateur a accès a l'entreprises passé en paramètre
    static isAutorized(idUser, idFirm)
    {       

            return new Promise((next) => 
            {
                console.log(idUser);
                console.log(idFirm);
                if(idUser && idUser.trim() != '')
                {
                    idUser = idUser.trim();
                    idFirm = idFirm.trim();

                    console.log(idUser);
                    console.log(idFirm);

                    db.query('SELECT * FROM f0001la WHERE TRIM(MSUSER) = ?', [idUser])
                    .then((result) => 
                    {
                        if(result[0] != undefined)
                            return   db.query('SELECT * FROM f0001la WHERE TRIM(MSUSER) = ? && ( (TRIM(MSMCUF) <= ? && TRIM(MSMCUT) >= ?) && (LENGTH(TRIM(MSMCUT)) = LENGTH(?)) )', [idUser,idFirm,idFirm, idFirm])
                        else
                            next(new Error(config.errors.wrongId));
                    })            
                    .then((result) => 
                    {
                        if(result[0] != undefined)
                        {
                            console.log(result);
                            next((true));
                        }
                        else
                        {
                            console.log(result);
                            next(new Error(config.errors.noAcces));
                        }
                       
                    }) 
                    .catch((err) => next(err))
                }
                else
                {
                    next(new Error(config.errors.noNameValue));
                }   
            });
    }    


    // Méthode permettant de récupérer les entreprises de l'utilisateur
    static getFirm(idUser)
    {       
            return new Promise((next) => 
            {
                if(idUser && idUser.trim() != '')
                {
                    idUser = idUser.trim();

                    console.log(idUser);

                    db.query('SELECT * FROM f0001la WHERE TRIM(MSUSER) = ?', [idUser])
                    .then((result) => 
                    {
                        if(result[0] != undefined)
                            return   db.query('SELECT * FROM f0001la WHERE TRIM(MSUSER) = ?', [idUser])
                        else
                            next(new Error(config.errors.wrongId));
                    })            
                    .then((result) => 
                    {
                        next((result));
                    }) 
                    .catch((err) => next(err))
                }
                else
                {
                    next(new Error(config.errors.noNameValue));
                }   
            });
    }    

}


