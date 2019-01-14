
// Méthode qui renvoit le status success et le resultat
exports.success =  (result) =>
{
    return {
        status : 'success',
        result :  result
    }
}

// Méthode qui renvoit le status error et le message d'erreur
exports.error = (message) =>
{
    return {
        status : 'error',
        message :  message
    }
}

// Méthode qui permet de verifier si l'objet passer en paramètre est une instance de Error
exports.isErr = (err) =>
{
    return err instanceof Error;
}

// Méthode qui permet de verifiier si l'objet est une error ou un success et d'appeler la méthode qui convient en fonction
exports.checkAndChange = (obj) =>
{
    if(this.isErr(obj))
        return this.error(obj.message);
    else
        return this.success(obj);
}