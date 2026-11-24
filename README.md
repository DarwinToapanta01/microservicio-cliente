# Arquitectura de Microservicios - Sistema de Facturación

Este repositorio implementa una arquitectura basada en microservicios desacoplados por dominio de negocio (**Cliente**, **Producto** y **Factura**) orquestados detrás de un **API Gateway**, utilizando un enfoque políglota donde cada servicio gestiona su propia lógica y persistencia de datos.

## Estructura del Proyecto

```text
microservicios/
├── api-gateway/   # Puerta de enlace y enrutamiento centralizado (Java / Spring Boot)
├── cliente/       # Microservicio de gestión de clientes (TypeScript / Bun / Node.js)
├── producto/      # Microservicio de catálogo e inventario (Python / FastAPI)
└── factura/       # Microservicio de emisión y consulta de facturas (TypeScript / NestJS / Prisma)
```

---

## Descripción de los Microservicios

### 1. API Gateway (`/api-gateway`)
* **Tecnología:** Java (Spring Boot / Maven)
* **Responsabilidad:** Punto único de entrada para las peticiones externas, enrutamiento hacia los microservicios internos y centralización del tráfico.

### 2. Microservicio Cliente (`/cliente`)
* **Tecnología:** TypeScript (Bun / Node.js)
* **Arquitectura:** Capas (`config`, `controllers`, `models`, `routes`)
* **Responsabilidad:** Registro, consulta, actualización y eliminación de información de clientes.

### 3. Microservicio Producto (`/producto`)
* **Tecnología:** Python (FastAPI / Uvicorn)
* **Arquitectura:** Modular (`config`, `controllers`, `models`, `router`, `schemas`)
* **Responsabilidad:** Administración del catálogo de productos, precios y disponibilidad.

### 4. Microservicio Factura (`/factura`)
* **Tecnología:** TypeScript (NestJS / Prisma ORM)
* **Arquitectura:** Modular (`modules`, `models`, `services`, `prisma`)
* **Responsabilidad:** Generación de comprobantes y coordinación de datos entre clientes y productos.

---

## Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas en tu entorno local:
* [Git](https://git-scm.com)
* [Java JDK](https://adoptium.net) (v17 o superior) y [Maven](https://apache.org) (o usar el wrapper `./mvnw` incluido)
* [Bun](https://bun.sh) o [Node.js](https://nodejs.org) (v18 o superior)
* [Python](https://python.org) (v3.10 o superior)
* Motor de base de datos configurado (ej. PostgreSQL / MySQL / MongoDB)

---

## Instalación y Ejecución Local

Clona este repositorio en tu máquina local:

```bash
git clone https://github.com
cd microservicio-cliente
```

### Levantar API Gateway
```bash
cd api-gateway
./mvnw spring-boot:run   # En Windows: .\mvnw.cmd spring-boot:run
```

### Levantar Microservicio Cliente
```bash
cd cliente
bun install        # o npm install
bun run index.ts   # o npm run dev
```

### Levantar Microservicio Producto
```bash
cd producto
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### Levantar Microservicio Factura
```bash
cd factura
npm install
npx prisma generate
npm run start:dev
```

---

## Variables de Entorno

Cada microservicio requiere su propio archivo `.env` en su carpeta raíz con las credenciales correspondientes (puerto de ejecución, URLs de comunicación entre servicios y cadena de conexión a base de datos). Ejemplo:

```env
PORT=3000
DATABASE_URL="tu_cadena_de_conexion"
```
