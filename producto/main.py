from fastapi import FastAPI

from config.database import engine, Base
from router.producto_router import router as producto_router

app = FastAPI(
    title="Servicio Producto",
    description="Servicio desarrollado en Arquitectura de software",
    version="1.0",
    redirect_slashes=False
)

Base.metadata.create_all(bind=engine)

app.include_router(producto_router, prefix="/api")

@app.get("/")

def inicio():
    return {"mensaje":"Servicio producto ejecutando con éxito"}
