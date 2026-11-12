from sqlalchemy.orm import Session
from models.producto import Producto
from schemas.producto import ProductoCreate

def obtener_productos(db : Session):
    return db.query(Producto).all()

def obtener_productos_id(db : Session, codigo: int):
    return db.query(Producto).filter(Producto.codigo == codigo).first()

def crear_productos(db : Session, producto: ProductoCreate):
    nuevo_producto = Producto(nombre=producto.nombre, descripcion=producto.descripcion, precio=producto.precio, stock=producto.stock)
    
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    
    return nuevo_producto

def actualizar_productos(db : Session, codigo: int, producto: ProductoCreate):
    producto_existente = obtener_productos_id(db, codigo)
    if not producto_existente:
        return None
    
    producto_existente.nombre = producto.nombre
    producto_existente.descripcion = producto.descripcion
    producto_existente.precio = producto.precio
    producto_existente.stock = producto.stock
    
    db.commit()
    db.refresh(producto_existente)
    
    return producto_existente

def eliminar_productos_id(db : Session, codigo: int):
    producto = obtener_productos_id(db, codigo)
    if not producto:
        return None
    
    db.delete(producto)
    db.commit()
    
    return producto