// config variables
import { variables } from 'config/variables';
// file management
import { join } from 'node:path';
import { readdir } from 'node:fs/promises';
// discord.js v14
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import type { Command } from 'types';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

client.once(Events.ClientReady, (client) => {
    console.log(`Logged in as ${client.user.displayName}`);
});

const commands = new Collection();

const currentDir = import.meta.dir;
const foldersPath = join(currentDir, '/commands');
const folders = await readdir(foldersPath);

for (const folder of folders) {

    const folderPath = join(foldersPath, folder);
    let files = await readdir(folderPath);
    files = files.filter(file => file.endsWith('.ts'));

    for (const file of files) {
        const filePath = join(folderPath, file);
        const { command } = await import(filePath) as { command: Command };

        if ('data' in command && 'execute' in command) {
            commands.set(command.data.name, command);
        }
    }

}

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    const command = commands.get(commandName) as Command;

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(variables.bot.token);