// config variables
import { variables } from 'config/variables';
import { type Command } from 'types';
// file management
import { join } from 'node:path';
import { readdir } from 'node:fs/promises';
import { REST, Routes } from 'discord.js';
// discord.js v14

const commands: unknown[] = [];

const currentDir = import.meta.dir;
const foldersPath = join(currentDir, '../commands');
const folders = await readdir(foldersPath);

for (const folder of folders) {

    const folderPath = join(foldersPath, folder);
    let files = await readdir(folderPath);
    files = files.filter(file => file.endsWith('.ts'));

    for (const file of files) {
        const filePath = join(folderPath, file);
        const { command } = await import(filePath) as { command: Command };

        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        }
    }

}

const rest = new REST().setToken(variables.bot.token);

async function deployCommands() {
    try {
        console.log('Started refreshing application (/) commands');

        const data = await rest.put(
            Routes.applicationCommands(variables.bot.id),
            { body: commands }
        );

        if (Array.isArray(data)) {
            console.log(`Successfully registered ${data.length} commands`);
        }
    } catch (error) {
        console.error(error);
    }
}

deployCommands();