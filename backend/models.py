from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    barcode = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    name = Column(
        String,
        nullable=False
    )

    sku = Column(
        String,
        nullable=False
    )

    expected_rack = Column(
        String,
        nullable=False
    )

    quantity = Column(
        Integer,
        default=0
    )

    current_location = Column(
        String,
        nullable=True
    )


class Rack(Base):
    __tablename__ = "racks"

    id = Column(Integer, primary_key=True, index=True)

    rack_code = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    name = Column(
        String,
        nullable=False
    )

    warehouse = Column(
        String,
        nullable=False
    )

    section = Column(
        String,
        nullable=False
    )


class Movement(Base):
    __tablename__ = "movements"

    id = Column(Integer, primary_key=True, index=True)

    barcode = Column(
        String,
        nullable=False
    )

    product_name = Column(
        String,
        nullable=False
    )

    movement_type = Column(
        String,
        nullable=False
    )

    rack_code = Column(
        String,
        nullable=True
    )

    timestamp = Column(
        DateTime,
        default=datetime.utcnow
    )