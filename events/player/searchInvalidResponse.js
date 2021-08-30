module.exports = async(client, queue, query, tracks, content, collector) => {
    if (!queue.metadata) return console.log("Not metadata")

    if (content === 'cancel') {
        collector.stop()
        return queue.metadata.succesMessage(`Recherche annulée avec succès `)
    }
    let numberErr = await queue.metadata.translate("NUMBER_ERROR")
    return queue.metadata.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "5"))
};