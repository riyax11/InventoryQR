from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc
from pydantic import BaseModel, Field
from datetime import datetime

from database import engine, Base, get_db
from models import Product, Rack, Movement


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="InventoryQR API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# REQUEST MODELS
# =========================

class ProductCreate(BaseModel):
    barcode: str
    name: str
    sku: str
    expected_rack: str
    quantity: int = Field(default=0, ge=0)


class RackCreate(BaseModel):
    rack_code: str
    name: str
    warehouse: str
    section: str


# =========================
# HOME
# =========================

@app.get("/")
def home():
    return {
        "message": "InventoryQR backend is running"
    }


# =========================
# PRODUCTS
# =========================

@app.get("/products")
def get_products(
    db: Session = Depends(get_db)
):
    products = (
        db.query(Product)
        .order_by(Product.id)
        .all()
    )

    return products


@app.get("/products/{barcode}")
def get_product(
    barcode: str,
    db: Session = Depends(get_db)
):
    product = (
        db.query(Product)
        .filter(Product.barcode == barcode)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not registered"
        )

    return product


@app.post("/products")
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db)
):

    existing_product = (
        db.query(Product)
        .filter(
            Product.barcode == product_data.barcode
        )
        .first()
    )

    if existing_product:
        raise HTTPException(
            status_code=400,
            detail="A product with this barcode already exists"
        )

    rack = (
        db.query(Rack)
        .filter(
            Rack.rack_code ==
            product_data.expected_rack
        )
        .first()
    )

    if not rack:
        raise HTTPException(
            status_code=400,
            detail="Selected rack is not registered"
        )

    product = Product(
        barcode=product_data.barcode,
        name=product_data.name,
        sku=product_data.sku,
        expected_rack=product_data.expected_rack,
        quantity=product_data.quantity,
        current_location=None,
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


# =========================
# RACKS
# =========================

@app.get("/racks")
def get_racks(
    db: Session = Depends(get_db)
):
    racks = (
        db.query(Rack)
        .order_by(Rack.rack_code)
        .all()
    )

    return racks


@app.get("/racks/{rack_code}")
def get_rack(
    rack_code: str,
    db: Session = Depends(get_db)
):
    rack = (
        db.query(Rack)
        .filter(
            Rack.rack_code == rack_code
        )
        .first()
    )

    if not rack:
        raise HTTPException(
            status_code=404,
            detail="Rack not registered"
        )

    return rack


@app.post("/racks")
def create_rack(
    rack_data: RackCreate,
    db: Session = Depends(get_db)
):

    existing_rack = (
        db.query(Rack)
        .filter(
            Rack.rack_code ==
            rack_data.rack_code
        )
        .first()
    )

    if existing_rack:
        raise HTTPException(
            status_code=400,
            detail="A rack with this code already exists"
        )

    rack = Rack(
        rack_code=rack_data.rack_code,
        name=rack_data.name,
        warehouse=rack_data.warehouse,
        section=rack_data.section,
    )

    db.add(rack)
    db.commit()
    db.refresh(rack)

    return rack


# =========================
# INBOUND INVENTORY
# =========================

@app.post("/inventory/inbound")
def inbound_product(
    barcode: str,
    rack_code: str,
    quantity: int,
    db: Session = Depends(get_db)
):

    if quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than 0"
        )

    product = (
        db.query(Product)
        .filter(
            Product.barcode == barcode
        )
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not registered"
        )

    rack = (
        db.query(Rack)
        .filter(
            Rack.rack_code == rack_code
        )
        .first()
    )

    if not rack:
        raise HTTPException(
            status_code=404,
            detail="Rack not registered"
        )

    if product.expected_rack != rack_code:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Wrong location. "
                f"Please move this product to "
                f"{product.expected_rack}"
            )
        )

    product.quantity = (
        product.quantity + quantity
    )

    product.current_location = rack_code

    movement = Movement(
        barcode=product.barcode,
        product_name=product.name,
        movement_type="INBOUND",
        rack_code=rack_code,
        timestamp=datetime.utcnow(),
    )

    db.add(movement)

    db.commit()
    db.refresh(product)

    return {
        "message": "Product successfully stored",
        "product": product.name,
        "barcode": product.barcode,
        "rack": rack_code,
        "quantity": product.quantity,
    }


# =========================
# OUTBOUND INVENTORY
# =========================

@app.post("/inventory/outbound")
def outbound_product(
    barcode: str,
    quantity: int,
    db: Session = Depends(get_db)
):

    # -------------------------
    # Validate quantity
    # -------------------------

    if quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than 0"
        )

    # -------------------------
    # Find product
    # -------------------------

    product = (
        db.query(Product)
        .filter(
            Product.barcode == barcode
        )
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not registered"
        )

    # -------------------------
    # Check available stock
    # -------------------------

    if product.quantity < quantity:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Insufficient stock. "
                f"Available quantity: "
                f"{product.quantity}"
            )
        )

    # -------------------------
    # Remember current location
    # -------------------------

    current_rack = product.current_location

    # -------------------------
    # Reduce stock
    # -------------------------

    product.quantity = (
        product.quantity - quantity
    )

    # -------------------------
    # Record movement
    # -------------------------

    movement = Movement(
        barcode=product.barcode,
        product_name=product.name,
        movement_type="OUTBOUND",
        rack_code=current_rack,
        timestamp=datetime.utcnow(),
    )

    db.add(movement)

    db.commit()
    db.refresh(product)

    return {
        "message": "Product successfully dispatched",
        "product": product.name,
        "barcode": product.barcode,
        "rack": current_rack,
        "quantity": product.quantity,
        "removed": quantity,
    }


# =========================
# INVENTORY
# =========================

@app.get("/inventory")
def get_inventory(
    db: Session = Depends(get_db)
):

    products = (
        db.query(Product)
        .order_by(Product.name)
        .all()
    )

    return products


# =========================
# MOVEMENT HISTORY
# =========================

@app.get("/movements")
def get_movements(
    db: Session = Depends(get_db)
):

    movements = (
        db.query(Movement)
        .order_by(
            desc(Movement.timestamp)
        )
        .all()
    )

    return movements