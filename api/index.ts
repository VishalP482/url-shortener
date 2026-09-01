import { app } from "./src/app";
import { env } from "./src/config/env";

const start = async () => {
    try {
        await app.listen({
            port: env.PORT,
            host: "0.0.0.0"
        });
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

start();