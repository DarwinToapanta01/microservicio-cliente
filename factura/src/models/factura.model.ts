import { DetalleFactura } from "./detalle-factura.model.js";

export interface Factura {
    codigo: string;
    fecha: string;
    cod_cliente: number;
    total: number;
    descuento: number;
    iva: number;
    total_a_pagar: number;

    detalles_factura: DetalleFactura[];
}