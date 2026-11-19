import { ServiceUnavailableException, Injectable, NotFoundException, HttpException } from '@nestjs/common';

import { Producto } from '../models/producto.model';

@Injectable()
export class ProductoClienteServicio {

    private readonly url = process.env.PRODUCTOS_URL;

    //private readonly url = "http://127.0.0.1:3002/api/productos";

    async consultar(codigo: number): Promise<any> {
        try {
            const respuesta = await fetch(`${this.url}/${codigo}`);
            if (respuesta.status == 404) {
                throw new NotFoundException("Producto no encontrado")
            }
            if (!respuesta.ok) {
                throw new ServiceUnavailableException("Error al consultar servicio")
            }

            const js = await respuesta.json();

            return js as Producto;

        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            console.error(error);
            throw new ServiceUnavailableException("No se pudo conectar con el microservicio de productos");
        }
    }
}