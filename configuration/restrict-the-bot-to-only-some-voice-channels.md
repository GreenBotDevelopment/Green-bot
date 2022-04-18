# Restrict the bot to only some voice channels

If you want to make Green-bot working only in some voice channels, you can use the `setvc` command.The bot will only work in the voice channels you'll set

#### Add a voice channel to the list

To add a voice channel to this list, run the following command:

Don't forget to replace "voice-channel" by your voice channel. It can be the ID of the voice channel or the name. You can check [this guide](https://www.remote.tools/remote-work/how-to-find-discord-id) to learn how to get the ID.

`green setvc voice-channel`

The channel is now in the list of the allowed voice channels! You can check with the `settings` command

#### Disable the restriction

Just do: `green setvc voice-channel` again and the channel will be removed from the list

