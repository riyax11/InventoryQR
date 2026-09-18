import { useState } from "react"
import { createRack } from "../services/api"

function RackMaster({ onBack }) {
  const [rackCode, setRackCode] = useState("")
  const [name, setName] = useState("")
  const [warehouse, setWarehouse] = useState("Warehouse A")
  const [section, setSection] = useState("Section 1")

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    setError("")
    setMessage("")

    if (
      !rackCode.trim() ||
      !name.trim() ||
      !warehouse.trim() ||
      !section.trim()
    ) {
      setError("Please fill all rack details.")
      return
    }

    try {
      setLoading(true)

      await createRack({
        rack_code: rackCode.trim(),
        name: name.trim(),
        warehouse: warehouse.trim(),
        section: section.trim(),
      })

      setMessage("Rack registered successfully.")

      setRackCode("")
      setName("")
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

        <h1>Rack Master</h1>

        <p className="page-subtitle">
          Register warehouse sections and rack locations.
        </p>
      </div>

      <div className="info-card">
        <form onSubmit={handleSubmit}>
          <label>Rack Code</label>

          <input
            value={rackCode}
            onChange={(e) => setRackCode(e.target.value)}
            placeholder="Example: RACK-A5"
            style={inputStyle}
          />

          <label>Rack Name</label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Example: Rack A5"
            style={inputStyle}
          />

          <label>Warehouse</label>

          <input
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            style={inputStyle}
          />

          <label>Section</label>

          <input
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="Example: Section 2"
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
            {loading ? "Registering..." : "Register Rack"}
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

export default RackMaster