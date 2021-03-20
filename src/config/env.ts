import dotenv from "dotenv";

dotenv.config();

export const env = new Proxy(process.env, {
    get: (env, prop) => {
      if (!(prop in env)) {
        throw new Error(`Environment variable ${String(prop)} not defined`);
      }
      return env[String(prop)];
    },
}) as { [key: string]: string };