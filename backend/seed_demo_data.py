"""Fill InventoryQR with demo data so every screen has something to show.

Start the backend first, then run:
    python seed_demo_data.py
    python seed_demo_data.py http://127.0.0.1:8000     (optional: a different backend address)

It uses the real API, so it also checks that the whole flow works. It is safe to run twice:
racks and products that already exist are skipped, and the stock movements are only added
when the movement history is empty.
"""

import json
import sys
import urllib.error
import urllib.parse
import urllib.request

API = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://127.0.0.1:8000"

RACKS = [
    ("RACK-A1", "Rack A1", "Warehouse A", "Section 1"),
    ("RACK-A2", "Rack A2", "Warehouse A", "Section 1"),
    ("RACK-A3", "Rack A3", "Warehouse A", "Section 2"),
    ("RACK-A4", "Rack A4", "Warehouse A", "Section 2"),
]

# barcode, name, SKU, assigned rack
PRODUCTS = [
    ("8901058000290", "Maggi 70g", "MAGGI70", "RACK-A3"),
    ("890000000003", "Lays Classic 50g", "LAYS50", "RACK-A2"),
    ("8901234567890", "Parle-G Biscuits 100g", "PARLEG100", "RACK-A2"),
    ("195949121234", "Apple 20W USB-C Power Adapter", "MUVR3HN/A", "RACK-A1"),
    ("195950643442", "iPhone 17", "IPHONE17", "RACK-A4"),
]

# barcode, rack, quantity
STOCK_IN = [
    ("8901058000290", "RACK-A3", 40),
    ("890000000003", "RACK-A2", 25),
    ("8901234567890", "RACK-A2", 30),
    ("195949121234", "RACK-A1", 12),
    ("195950643442", "RACK-A4", 8),
]

# barcode, quantity
STOCK_OUT = [
    ("8901058000290", 7),
    ("890000000003", 3),
    ("195950643442", 2),
]


def call(method, path, body=None, query=None):
    """Send a request to the API. Returns (status_code, parsed_json_or_detail)."""
    url = API + path
    if query:
        url += "?" + urllib.parse.urlencode(query)
    data = json.dumps(body).encode() if body is not None else None
    headers = {"Content-Type": "application/json"} if data else {}
    request = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            raw = response.read()
            return response.status, json.loads(raw) if raw else None
    except urllib.error.HTTPError as error:
        try:
            detail = json.loads(error.read()).get("detail", "")
        except Exception:
            detail = ""
        return error.code, detail
    except urllib.error.URLError:
        sys.exit(
            f"Cannot reach the backend at {API}.\n"
            "Start it first (run-backend.bat, or: uvicorn main:app --reload) and try again."
        )


def main():
    for code, name, warehouse, section in RACKS:
        status, detail = call("POST", "/racks", {
            "rack_code": code, "name": name, "warehouse": warehouse, "section": section})
        if status == 200:
            print(f"Rack added:     {code}")
        elif status == 400:
            print(f"Rack exists:    {code} (skipped)")
        else:
            sys.exit(f"Could not add rack {code}: HTTP {status} {detail}")

    for barcode, name, sku, rack in PRODUCTS:
        status, detail = call("POST", "/products", {
            "barcode": barcode, "name": name, "sku": sku, "expected_rack": rack, "quantity": 0})
        if status == 200:
            print(f"Product added:  {name}")
        elif status == 400 and "already exists" in str(detail):
            print(f"Product exists: {name} (skipped)")
        else:
            sys.exit(f"Could not add product {name}: HTTP {status} {detail}")

    status, movements = call("GET", "/movements")
    if status != 200:
        sys.exit(f"Could not read the movement history: HTTP {status}")
    if movements:
        print("Movement history already has entries, so no stock was added.")
        return

    for barcode, rack, quantity in STOCK_IN:
        status, detail = call("POST", "/inventory/inbound",
                              query={"barcode": barcode, "rack_code": rack, "quantity": quantity})
        if status != 200:
            sys.exit(f"Scan in failed for {barcode}: HTTP {status} {detail}")
        print(f"Stored:         {quantity} x {barcode} on {rack}")

    for barcode, quantity in STOCK_OUT:
        status, detail = call("POST", "/inventory/outbound",
                              query={"barcode": barcode, "quantity": quantity})
        if status != 200:
            sys.exit(f"Scan out failed for {barcode}: HTTP {status} {detail}")
        print(f"Dispatched:     {quantity} x {barcode}")

    print("\nDone. Open the app and look at Inventory.")


if __name__ == "__main__":
    main()
