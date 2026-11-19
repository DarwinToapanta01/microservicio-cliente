import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../prisma/db';
import { Factura } from '../../models/factura.model'
import { DetalleFactura } from '../../models/detalle-factura.model'

@Injectable()
export class FacturaService {

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
        const detalles: DetalleFactura[] = [...(factura.detalles_factura ?? [])];

        const existeDetalle = detalles.some((d) => d.codigo === data.codigo);
        if (existeDetalle) {
            throw new ConflictException("codigo de detalle ya existe en esta factura");
        }

        const nuevosDetalles = [...detalles, data];

        return db.orm.Factura.where({ codigo }).update({
            detalles_factura: nuevosDetalles
        });
    }


    async actualizarDetalle(
        codigo: string,
        codigoDetalle: number,
        data: Partial<DetalleFactura>
    ) {
        const factura = await this.consultar(codigo);
        const detalles: DetalleFactura[] = [...(factura.detalles_factura ?? [])];

        const index = detalles.findIndex((d) => d.codigo === codigoDetalle);
        if (index === -1) {
            throw new NotFoundException("detalle no encontrado");
        }

        detalles[index] = {
            ...detalles[index],
            ...data,
            codigo: codigoDetalle
        };

        return db.orm.Factura.where({ codigo }).update({
            detalles_factura: detalles
        });
    }

    async eliminarDetalle(codigo: string, codigoDetalle: number) {
        const factura = await this.consultar(codigo);
        const detalles: DetalleFactura[] = [...(factura.detalles_factura ?? [])];

        const nuevosDetalles = detalles.filter((d) => d.codigo !== codigoDetalle);

        if (nuevosDetalles.length === detalles.length) {
            throw new NotFoundException("detalle de factura no encontrado");
        }

        return db.orm.Factura.where({ codigo }).update({
            detalles_factura: nuevosDetalles
        });
    }
}
