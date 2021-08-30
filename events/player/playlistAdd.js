module.exports = (client, queue, playlist) => {
    if (!queue.metadata) return console.log("Not metadata")

    queue.metadata.mainMessage(`Playlist succesfully added to the queue`);

};