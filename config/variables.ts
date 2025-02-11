import { z } from 'zod';

const variablesSchema = z.object({
    bot: z.object({
        token: z.string({ message: 'Please provide a Discord bot token' }),
        prefix: z.string(),
        id: z.string(),
    }),
});

export type Variables = z.infer<typeof variablesSchema>;

const {
    DISCORD_BOT_TOKEN,
    DISCORD_BOT_PREFIX,
    DISCORD_CLIENT_ID,
} = import.meta.env;

export const variables: Variables = variablesSchema.parse({
    bot: {
        token: DISCORD_BOT_TOKEN,
        prefix: DISCORD_BOT_PREFIX,
        id: DISCORD_CLIENT_ID,
    },
});