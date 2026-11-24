import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { db } from '../../prisma/db.js';
import { Factura } from '../../models/factura.model.js'
import { DetalleFactura } from '../../models/detalle-factura.model.js'
import { ProductoClienteServicio } from '../../services/producto-cliente.service.js'

@Injectable()
export class FacturaService {

    constructor(
        private readonly productoCliente: ProductoClienteServicio
    ) { }

    //Esto es de factura
    async crear(data: Factura) {
        const factura = await db.orm.Factura.where({ codigo: data.codigo }).first();
        if (factura) {
            throw new ConflictException("Codigo ya existente");
        }

        return db.orm.Factura.create({ ...data, fecha: new Date(data.fecha) });
    }

    async listar() {
        return db.orm.Factura.all();
    }

    async consultar(codigo: string) {
        const factura = await db.orm.Factura.where({ codigo: codigo }).first();

        if (!factura) {
            throw new NotFoundException("Factura no encontrada")
        }

        return factura;
    }

    async actualizar(codigo: string, data: Partial<Factura>) {
        const cambios: Record<string, unknown> = { ...data }
        if (data.fecha) {
            cambios.fecha = new Date(data.fecha);
        }
        const factura = await db.orm.Factura.where({ codigo: codigo }).update(cambios);

        if (!factura) {
            throw new NotFoundException("Factura no encontrada")
        }

        return factura;
    }

    async eliminar(codigo: string) {
        await this.consultar(codigo);

        await db.orm.Factura.where({ codigo }).delete();

        return { mensaje: "Factura elminada" };
    }

    //Detalle de factura

    async agregarDetalle(codigo: string, data: DetalleFactura) {
        const factura = await this.consultar(codigo);
        const producto = await this.productoCliente.consultar(data.cod_producto);

        const nuevoDetalle: DetalleFactura = {
            ...data,
            subtotal: this.calcularSubtotal(producto.precio, data.cantidad)
        };

        const nuevosDetalle = [...(factura.detalles_factura ?? []), nuevoDetalle];

        return db.orm.Factura.where({ codigo }).update({
            detalles_factura: nuevosDetalle
        });
    }



    async actualizarDetalle(codigo: string, codigoDetalle: number, data: Partial<DetalleFactura>) {
        const factura = await this.consultar(codigo);
        const detalles: DetalleFactura[] = [...(factura.detalles_factura ?? [])];

        const index = detalles.findIndex((d) => d.codigo === codigoDetalle);
        if (!index) {
            throw new NotFoundException("Detalle no encontrado");
        }

        const codProducto = data.cod_producto ?? detalles[index].cod_producto;
        const cantidad = data.cantidad ?? detalles[index].cantidad;
        const producto = await this.productoCliente.consultar(codProducto);

        detalles[index] = {
            ...detalles[index],
            ...data,
            codigo: codigoDetalle,
            subtotal: this.calcularSubtotal(producto.precio, cantidad)
        };

        return db.orm.Factura.where({ codigo }).update({
            detalles_factura: detalles
        });
    }


    async eliminarDetalle(codigo: string, codigoDetalle: number) {
        const factura = await this.consultar(codigo);
        const detalles: DetalleFactura[] = [...(factura.detalles_factura ?? [])];

        const nuevosDetalles = detalles.filter((d) => d.codigo !== codigoDetalle);

        return db.orm.Factura.where({ codigo: factura.codigo }).update({
            detalles_factura: nuevosDetalles
        });
    }

    public calcularSubtotal(precio: number, cantidad: number): number {
        return Number((precio * cantidad).toFixed(2));
    }
}
