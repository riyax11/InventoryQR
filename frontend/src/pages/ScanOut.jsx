import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import {
  getProduct,
  outboundProduct,
} from "../services/api"

function ScanOut({ onBack }) {
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState("1")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [scannerStarted, setScannerStarted] = useState(false)

  const scannerRef = useRef(null)
  const isScanningRef = useRef(false)
  const scanHandledRef = useRef(false)

  useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [])

  async function startScanner() {
    try {
      setError("")
      setProduct(null)
      setResult(null)
      setQuantity("1")

      scanHandledRef.current = false

      if (isScanningRef.current) {
        return
      }

      const scanner = new Html5Qrcode("out-reader")

      scannerRef.current = scanner
      isScanningRef.current = true
      setScannerStarted(true)

      await scanner.start(
        {
          facingMode: "environment",
        },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        async (decodedText) => {
          if (!isScanningRef.current) {
            return
          }

          if (scanHandledRef.current) {
            return
          }

          scanHandledRef.current = true

          await handleScan(decodedText)
        },
        () => {}
      )
    } catch (err) {
      console.error("Outbound camera error:", err)

      isScanningRef.current = false
      setScannerStarted(false)

      setError(
        "Unable to access camera. Please allow camera permission."
      )
    }
  }

  async function stopScanner() {
    try {
      if (
        scannerRef.current &&
        isScanningRef.current
      ) {
        isScanningRef.current = false

        await scannerRef.current.stop()

        await scannerRef.current.clear()
      }
    } catch (err) {
      console.log("Scanner cleanup:", err)
    }

    scannerRef.current = null
    setScannerStarted(false)
  }

  async function handleScan(code) {
    await stopScanner()

    try {
      setLoading(true)
      setError("")

      const cleanCode = String(code).trim()

      const productData = await getProduct(cleanCode)

      setProduct(productData)
    } catch (err) {
      console.error("Product lookup error:", err)

      setProduct(null)

      setError(
        err.message ||
        "Product not registered."
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleDispatch() {
    console.log("CONFIRM DISPATCH CLICKED")

    if (loading) {
      return
    }

    if (!product) {
      setError("Please scan a product first.")
      return
    }

    const qty = Number(quantity)

    console.log("Dispatch details:", {
      barcode: product.barcode,
      quantity: qty,
      availableStock: product.quantity,
    })

    if (!Number.isInteger(qty) || qty <= 0) {
      setError("Please enter a valid quantity.")
      return
    }

    if (product.quantity <= 0) {
      setError(
        "This product has 0 stock. Receive stock first using Inbound."
      )
      return
    }

    if (qty > product.quantity) {
      setError(
        `Only ${product.quantity} units are available.`
      )
      return
    }

    try {
      setLoading(true)
      setError("")

      console.log("Sending outbound request...")

      const response = await outboundProduct(
        product.barcode,
        qty
      )

      console.log("Outbound response:", response)

      setResult(response)
    } catch (err) {
      console.error("Outbound error:", err)

      setError(
        err.message ||
        "Unable to dispatch product."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">

      <div className="page-header">

        <button
          type="button"
          onClick={onBack}
          className="back-button"
        >
          ← Back
        </button>

        <p className="eyebrow">
          OUTBOUND
        </p>

        <h1>
          Stock Out
        </h1>

        <p className="page-subtitle">
          Scan a product to remove stock from inventory.
        </p>

      </div>

      {!product && !result && (
        <>
          <div
            id="out-reader"
            className="scanner-box"
          />

          {!scannerStarted && (
            <button
              type="button"
              onClick={startScanner}
              className="primary-button"
              style={{
                width: "100%",
                marginTop: "16px",
              }}
            >
              📷 Start Camera Scanner
            </button>
          )}

          <div
            style={{
              textAlign: "center",
              marginTop: "14px",
              color: "#71809a",
              fontSize: "13px",
            }}
          >
            Point your camera at the product barcode / QR.
          </div>
        </>
      )}

      {loading && (
        <div
          className="info-card"
          style={{
            marginTop: "18px",
          }}
        >
          Processing...
        </div>
      )}

      {error && (
        <div
          className="error-card"
          style={{
            marginTop: "18px",
          }}
        >
          {error}
        </div>
      )}

      {product && !result && (
        <div
          className="info-card"
          style={{
            marginTop: "20px",
          }}
        >

          <div
            style={{
              color: "#79e2a8",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            ✓ PRODUCT IDENTIFIED
          </div>

          <h2
            style={{
              margin: "0 0 6px",
            }}
          >
            {product.name}
          </h2>

          <p
            style={{
              color: "#9aa8bc",
              margin: "5px 0",
            }}
          >
            Barcode:{" "}
            <strong>{product.barcode}</strong>
          </p>

          <p
            style={{
              color: "#9aa8bc",
              margin: "5px 0",
            }}
          >
            SKU:{" "}
            <strong>{product.sku}</strong>
          </p>

          <p
            style={{
              color: "#9aa8bc",
              margin: "5px 0",
            }}
          >
            Current Stock:{" "}
            <strong>{product.quantity}</strong>
          </p>

          <p
            style={{
              color: "#9aa8bc",
              margin: "5px 0",
            }}
          >
            Current Rack:{" "}
            <strong>
              {product.current_location || "Not assigned"}
            </strong>
          </p>

          <div
            style={{
              marginTop: "20px",
            }}
          >

            <label>
              Quantity to dispatch
            </label>

            <input
              type="number"
              min="1"
              step="1"
              max={product.quantity}
              value={quantity}
              disabled={loading}
              onChange={(e) => {
                setQuantity(e.target.value)
                setError("")
              }}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px",
                marginTop: "8px",
                borderRadius: "10px",
                border: "1px solid #2c3950",
                background: "#0b1220",
                color: "white",
                fontSize: "18px",
              }}
            />

          </div>

          <button
            type="button"
            onClick={handleDispatch}
            disabled={loading}
            className="primary-button"
            style={{
              width: "100%",
              marginTop: "18px",
              opacity: loading ? 0.6 : 1,
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Dispatching..."
              : "Confirm Dispatch →"}
          </button>

        </div>
      )}

      {result && (
        <div
          className="success-card"
          style={{
            marginTop: "20px",
          }}
        >

          <div
            style={{
              fontSize: "28px",
              marginBottom: "8px",
            }}
          >
            ✓
          </div>

          <h2
            style={{
              margin: "0 0 10px",
            }}
          >
            Product Dispatched
          </h2>

          <p>
            {result.message}
          </p>

          <div
            style={{
              marginTop: "15px",
            }}
          >

            <p>
              Product:{" "}
              <strong>
                {result.product}
              </strong>
            </p>

            <p>
              Removed:{" "}
              <strong>
                -{result.removed}
              </strong>
            </p>

            <p>
              Remaining Stock:{" "}
              <strong>
                {result.quantity}
              </strong>
            </p>

          </div>

          <button
            type="button"
            onClick={onBack}
            className="primary-button"
            style={{
              width: "100%",
              marginTop: "18px",
            }}
          >
            Done
          </button>

        </div>
      )}

    </div>
  )
}

export default ScanOut