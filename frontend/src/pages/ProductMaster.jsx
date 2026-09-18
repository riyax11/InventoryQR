import { useEffect, useState } from "react"
import { createProduct, getRacks } from "../services/api"

function ProductMaster({ onBack }) {
  const [racks, setRacks] = useState([])

  const [barcode, setBarcode] = useState("")
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [expectedRack, setExpectedRack] = useState("")
  const [quantity, setQuantity] = useState("0")

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadRacks()
  }, [])

  async function loadRacks() {
    try {
      const data = await getRacks()
      setRacks(data)

      if (data.length > 0) {
        setExpectedRack(data[0].rack_code)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setError("")
    setMessage("")

    if (!barcode.trim() || !name.trim() || !sku.trim()) {
      setError("Please fill all product details.")
      return
    }

    if (!expectedRack) {
      setError("Please register a rack first.")
      return
    }

    const qty = Number(quantity)

    if (!Number.isInteger(qty) || qty < 0) {
      setError("Quantity must be 0 or greater.")
      return
    }

    try {
      setLoading(true)

      await createProduct({
        barcode: barcode.trim(),
        name: name.trim(),
        sku: sku.trim(),
        expected_rack: expectedRack,
        quantity: qty,
      })

      setMessage("Product registered successfully.")

      setBarcode("")
      setName("")
      setSku("")
      setQuantity("0")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={onBack} className="back-button">
          ← Back to Dashboard
        </button>

        <p className="eyebrow">MASTER DATA</p>

        <h1>Product Master</h1>

        <p className="page-subtitle">
          Register products and assign their expected warehouse location.
        </p>
      </div>

      <div className="info-card">
        <form onSubmit={handleSubmit}>
          <label>Product Barcode / QR ID</label>

          <input
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Example: 8901058000290"
            style={inputStyle}
          />

          <label>Product Name</label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Example: Maggi 70g"
            style={inputStyle}
          />

          <label>SKU</label>

          <input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Example: MAGGI70"
            style={inputStyle}
          />

          <label>Expected Rack</label>

          <select
            value={expectedRack}
            onChange={(e) => setExpectedRack(e.target.value)}
            style={inputStyle}
          >
            {racks.length === 0 ? (
              <option value="">
                No racks registered
              </option>
            ) : (
              racks.map((rack) => (
                <option
                  key={rack.rack_code}
                  value={rack.rack_code}
                >
                  {rack.rack_code} — {rack.name}
                </option>
              ))
            )}
          </select>

          <label>Opening Quantity</label>

          <input
            type="number"
            min="0"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={inputStyle}
          />

          {error && (
            <div
              className="error-card"
              style={{ marginBottom: "15px" }}
            >
              {error}
            </div>
          )}

          {message && (
            <div
              className="success-card"
              style={{ marginBottom: "15px" }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            className="primary-button"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Product"}
          </button>
        </form>
      </div>
    </div>
  )
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  marginTop: "7px",
  marginBottom: "18px",
  borderRadius: "10px",
  border: "1px solid #2c3950",
  background: "#0b1220",
  color: "white",
  fontSize: "15px",
}

export default ProductMaster