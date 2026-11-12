import type { FastifyInstance } from "fastify";

import { obtenerClientes, obtenerClienteId, actualizarCliente, crearCliente, eliminarCliente } from "../controllers/cliente.controller";

export const clienteRouter = (app: FastifyInstance) => {
    app.get("clientes", obtenerClientes);

    app.get("/cliente/:id", async (req, res) => {
        try {
            const { id } = req.params as any;
            return await obtenerClienteId(id);
        } catch (error) {
            console.log("Error al obtener todos los clientes");
            res.code(400).send({ "mensaje": "Error en obtener clientes" });
        }
    });

    app.post("/clientes", async (req, res) => {
        try {
            const cliente = req.body;
            return await crearCliente(cliente);
        } catch (error) {
            console.log("Error al crear clientes");
            res.code(400).send({ "mensaje": "Error al crear clientes" });
        }
    });

    app.put("/cliente/:id", async (req, res) => {
        try {
            const { id } = req.params as any;
            const cliente = req.body;
            return await actualizarCliente(id, cliente);
        } catch (error) {
            console.log("Error al actualizar cliente");
            res.code(400).send({ "mensaje": "Error en actualizar cliente" });
        }
    });

    app.delete("/cliente/:id", async (req, res) => {
        try {
            const { id } = req.params as any;
            return await eliminarCliente(id);
        } catch (error) {
            console.log("Error al eliminar cliente");
            res.code(400).send({ "mensaje": "Error en eliminar cliente" });
        }
    });
}