import { useEffect, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { getRacks } from "../services/api"

function GenerateRackQR({ onBack }) {
  const [racks, setRacks] = useState([])
  const [rackCode, setRackCode] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadRacks() {
    try {
      setLoading(true)

      const data = await getRacks()

      setRacks(data)

      if (data.length > 0) {
        setRackCode(data[0].rack_code)
      }

      setError("")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRacks()
  }, [])

  const selectedRack = racks.find(
    (rack) => rack.rack_code === rackCode
  )

  return (
    <div
      className="page-container"
      style={{
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <div className="page-header">
        <button onClick={onBack} className="back-button">
          ← Back to Dashboard
        </button>

        <p className="eyebrow">PROTOTYPE TOOLS</p>

        <h1>Rack QR Generator</h1>

        <p className="page-subtitle">
          Generate QR labels for registered warehouse racks.
        </p>
      </div>

      <div
        className="info-card"
        style={{
          padding: "22px",
        }}
      >
        {loading ? (
          <p style={{ color: "#9aa8bc" }}>
            Loading racks...
          </p>
        ) : error ? (
          <div className="error-card">
            {error}
          </div>
        ) : racks.length === 0 ? (
          <p style={{ color: "#9aa8bc" }}>
            No racks registered yet.
          </p>
        ) : (
          <>
            <label>Select Rack</label>

            <select
              value={rackCode}
              onChange={(e) => setRackCode(e.target.value)}
              style={inputStyle}
            >
              {racks.map((rack) => (
                <option
                  key={rack.rack_code}
                  value={rack.rack_code}
                >
                  {rack.rack_code} — {rack.name}
                </option>
              ))}
            </select>

            {selectedRack && (
              <>
                <div
                  style={{
                    background: "#0b1220",
                    border: "1px solid #253047",
                    borderRadius: "14px",
                    padding: "18px",
                    marginBottom: "20px",
                  }}
                >
                  <h2
                    style={{
                      marginTop: 0,
                      marginBottom: "8px",
                    }}
                  >
                    {selectedRack.name}
                  </h2>

                  <p
                    style={{
                      color: "#9aa8bc",
                      margin: 0,
                    }}
                  >
                    {selectedRack.warehouse}
                    {" → "}
                    {selectedRack.section}
                  </p>

                  <p
                    style={{
                      color: "#9aa8bc",
                      marginTop: "8px",
                      marginBottom: 0,
                    }}
                  >
                    Rack Code:{" "}
                    <strong style={{ color: "white" }}>
                      {selectedRack.rack_code}
                    </strong>
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      backgroundColor: "white",
                      padding: "20px",
                      display: "inline-block",
                      borderRadius: "12px",
                    }}
                  >
                    <QRCodeCanvas
                      value={selectedRack.rack_code}
                      size={250}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      includeMargin={true}
                    />
                  </div>

                  <p
                    style={{
                      color: "#9aa8bc",
                      marginTop: "15px",
                    }}
                  >
                    QR Value:{" "}
                    <strong style={{ color: "white" }}>
                      {selectedRack.rack_code}
                    </strong>
                  </p>

                  <p
                    style={{
                      color: "#6f7f96",
                      fontSize: "13px",
                    }}
                  >
                    Print this QR and place it on the physical rack.
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  marginTop: "7px",
  marginBottom: "20px",
  borderRadius: "10px",
  border: "1px solid #2c3950",
  background: "#0b1220",
  color: "white",
  fontSize: "15px",
}

export default GenerateRackQR