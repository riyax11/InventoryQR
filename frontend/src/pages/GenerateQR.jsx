import { useState } from "react"
import { QRCodeCanvas } from "qrcode.react"

function GenerateQR({ onBack }) {
  const [qrValue, setQrValue] = useState("QR001")

  return (
    <div className="page-container">

      <div className="page-header">

        <button
          onClick={onBack}
          className="back-button"
        >
          ← Back to Dashboard
        </button>

        <p className="eyebrow">
          PROTOTYPE TOOL
        </p>

        <h1>
          Product QR Generator
        </h1>

        <p className="page-subtitle">
          Generate a QR code for a registered product.
        </p>

      </div>

      <div className="info-card">

        <p>
          Enter the Product QR ID:
        </p>

        <input
          type="text"
          value={qrValue}
          onChange={(e) =>
            setQrValue(e.target.value)
          }
          placeholder="Example: QR001"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "12px",
            marginTop: "8px",
            borderRadius: "8px",
            border: "1px solid #2a3548",
            background: "#111827",
            color: "white",
            fontSize: "16px",
          }}
        />

        <div
          style={{
            marginTop: "24px",
            textAlign: "center",
          }}
        >

          {qrValue.trim() && (
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                display: "inline-block",
                borderRadius: "12px",
              }}
            >
              <QRCodeCanvas
                value={qrValue.trim()}
                size={250}
                bgColor="#ffffff"
                fgColor="#000000"
                includeMargin={true}
              />
            </div>
          )}

        </div>

        <p
          style={{
            marginTop: "18px",
            textAlign: "center",
          }}
        >
          QR Code Value:{" "}
          <strong>
            {qrValue}
          </strong>
        </p>

      </div>

    </div>
  )
}

export default GenerateQR