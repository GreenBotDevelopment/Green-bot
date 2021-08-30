module.exports = (client, queue, query, tracks) => {
    if (!queue.metadata) return console.log("Not metadata")

    queue.metadata.errorMessage(` Vous n'avez pas fourni de bonne réponse , veuillez refaire la commande.`);

};