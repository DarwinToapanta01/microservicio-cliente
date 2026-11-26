from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from config.database import obtener_db
from schemas.producto import ProductoCreate, ProductoResponse
from controllers import producto_controller

router = APIRouter(
    prefix="/producto",
    tags=["productos"]
)

@router.get("", response_model=list[ProductoResponse])
def listar_productos(db : Session = Depends(obtener_db)):
    return producto_controller.obtener_productos(db)

@router.get("/{codigo}", response_model=ProductoResponse)
def buscar_producto(codigo: int, db: Session = Depends(obtener_db)):
    producto = producto_controller.obtener_productos_id(db, codigo)
    if not producto:
        raise HTTPException(400, "Producto no encontrado")
    return producto

@router.post("", response_model=ProductoResponse)
def registrar_producto(producto: ProductoCreate, db: Session = Depends(obtener_db)):
    return producto_controller.crear_productos(db, producto)

@router.put("/{codigo}", response_model=ProductoResponse)
def actualizar_producto(codigo: int, producto: ProductoCreate, db: Session = Depends(obtener_db)):
    producto_actualizado = producto_controller.actualizar_productos(db, codigo, producto)
    if not producto_actualizado:
        raise HTTPException(404, detail="Producto no encontrado")
    return producto_actualizado

@router.delete("/{codigo}")
def eliminar_producto(codigo: int, db: Session = Depends(obtener_db)):
    producto_eliminado = producto_controller.eliminar_productos_id(db, codigo)
    if not producto_eliminado:
        raise HTTPException(404, detail="Producto no encontrado")
    return {"mensaje":"Producto eliminado correctamente"}
