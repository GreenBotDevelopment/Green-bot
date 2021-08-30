module.exports = async(client, queue, query) => {
    if (!queue.metadata) return console.log("Not metadata")

    let errorM = await queue.metadata.translate("NO_RESULTS")
    queue.metadata.errorMessage(errorM.replace("{query}", query));

};