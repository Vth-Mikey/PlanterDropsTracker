require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('logbook')
        .setDescription('Open the Planter Logbook to track drops'),
    new SlashCommandBuilder()
        .setName('backup')
        .setDescription('Receive a copy of the current logs.json file via DM'),
    new SlashCommandBuilder()
        .setName('stats')
        .setDescription('View global bot statistics (Owner Only)'),
    new SlashCommandBuilder()
        .setName('encyclopedia')
        .setDescription('Browse a book-style guide of all planter drops'),
    new SlashCommandBuilder()
        .setName('broadcast')
        .setDescription('Send a DM to all bot users (Owner Only)')
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The announcement message to send')
                .setRequired(true)
        ), // <--- Notice the closing parenthesis and comma here!
    new SlashCommandBuilder()
        .setName('serverlist')
        .setDescription('View all servers the bot is currently in (Owner Only)')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationCommands('1484117813898772684'),
            { body: commands },
        );
        console.log('Successfully registered commands!');
    } catch (error) {
        console.error(error);
    }
})();
