import { Module } from '@nestjs/common';
import { FacturaController } from './factura.controller.js';
import { FacturaService } from './factura.service.js';
import { ProductoClienteServicio } from '../../services/producto-cliente.service.js';

@Module({
  controllers: [FacturaController],
  providers: [FacturaService, ProductoClienteServicio]
})
export class FacturaModule {}
