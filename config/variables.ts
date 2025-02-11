import { z } from 'zod';

const variablesSchema = z.object({
    discord: z.object({
        bot: z.object({
            token: z.string({ message: 'Please provide a Discord bot token' }),
            prefix: z.string(),
        }),
        app: z.object({
            id: z.string(),
        }),
    }),
});

export type Variables = z.infer<typeof variablesSchema>;

const {
    DISCORD_BOT_TOKEN,
    DISCORD_BOT_PREFIX,
    DISCORD_APP_ID,
} = import.meta.env;

export const variables: Variables = variablesSchema.parse({
    discord: {
        bot: {
            token: DISCORD_BOT_TOKEN,
            prefix: DISCORD_BOT_PREFIX,
        },
        app: {
            id: DISCORD_APP_ID,
        },
    },
});