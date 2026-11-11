import fastify from "fastify";
import { clienteRouter } from "./src/routes/cliente.router";
import { sequelize } from "./src/config/database";

const PORT = Number(process.env.PORT) || 3001;

const app = fastify({
    logger: true
});

app.register(clienteRouter, { prefix: "/api" });

const iniciar = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        await app.listen({
            port: PORT,
            host: "0.0.0.0"
        });
        console.log("Microservicio cliente ejecutando en el puerto" + PORT)
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}

iniciar();