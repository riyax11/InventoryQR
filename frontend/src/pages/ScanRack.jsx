import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { inboundProduct } from "../services/api"

function ScanRack({ product, onBack }) {
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [scannerStarted, setScannerStarted] = useState(false)
  const [lastScannedCode, setLastScannedCode] = useState("")

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
      setResult(null)
      setLastScannedCode("")
      scanHandledRef.current = false

      if (isScanningRef.current) {
        return
      }

      const scanner = new Html5Qrcode("rack-reader")

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
          console.log("RACK QR DETECTED:", decodedText)

          setLastScannedCode(decodedText)

          if (scanHandledRef.current) {
            return
          }

          scanHandledRef.current = true

          await handleRackScan(decodedText)
        },
        () => {
          // Ignore normal scan failures while camera is searching.
        }
      )
    } catch (err) {
      console.error("Rack camera error:", err)

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

  async function handleRackScan(rackCode) {
    const cleanRackCode = String(rackCode).trim()

    console.log(
      "Processing rack code:",
      cleanRackCode
    )

    await stopScanner()

    try {
      const quantity =
        Number(product?.inboundQuantity) || 1

      console.log("Product:", product.barcode)
      console.log("Rack:", cleanRackCode)
      console.log("Quantity:", quantity)

      const response = await inboundProduct(
        product.barcode,
        cleanRackCode,
        quantity
      )

      setResult({
        success: true,
        message: response.message,
        product: response.product,
        rack: response.rack,
        quantity: response.quantity,
        added: quantity,
      })
    } catch (err) {
      console.error(
        "Rack verification error:",
        err
      )

      setResult({
        success: false,
        message:
          err.message ||
          "Unable to verify rack.",
      })
    }
  }

  if (!product) {
    return (
      <div className="page-container">
        <div className="page-header">
          <button
            onClick={onBack}
            className="back-button"
          >
            ← Back
          </button>

          <p className="eyebrow">
            LOCATION VERIFICATION
          </p>

          <h1>No Product Selected</h1>

          <p className="page-subtitle">
            Please scan a product first.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">

      <div className="page-header">

        <button
          onClick={onBack}
          className="back-button"
        >
          ← Back
        </button>

        <p className="eyebrow">
          LOCATION VERIFICATION
        </p>

        <h1>Scan Rack</h1>

        <p className="page-subtitle">
          Verify that the product is being stored
          in the correct location.
        </p>

      </div>


      <div
        className="info-card"
        style={{ marginBottom: "18px" }}
      >

        <div
          style={{
            color: "#8b9bb4",
            fontSize: "12px",
            textTransform: "uppercase",
          }}
        >
          Product
        </div>

        <h2 style={{ margin: "6px 0" }}>
          {product.name}
        </h2>

        <p
          style={{
            color: "#9aa8bc",
            margin: "5px 0",
          }}
        >
          Quantity:{" "}
          <strong>
            {product.inboundQuantity}
          </strong>
        </p>

        <p
          style={{
            color: "#9aa8bc",
            margin: "5px 0",
          }}
        >
          Expected Rack:{" "}
          <strong>
            {product.expected_rack}
          </strong>
        </p>

      </div>


      {!result && (
        <>
          <div
            id="rack-reader"
            className="scanner-box"
          />

          {!scannerStarted && (
            <button
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
            Point your camera at the rack QR code.
          </div>

          {lastScannedCode && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                borderRadius: "10px",
                background: "#0b1220",
                border: "1px solid #253047",
                color: "#9aa8bc",
                fontSize: "13px",
                textAlign: "center",
              }}
            >
              QR detected:{" "}
              <strong style={{ color: "white" }}>
                {lastScannedCode}
              </strong>
            </div>
          )}
        </>
      )}


      {error && (
        <div
          className="error-card"
          style={{ marginTop: "18px" }}
        >
          {error}
        </div>
      )}


      {result && (
        <div
          className={
            result.success
              ? "success-card"
              : "error-card"
          }
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
            {result.success ? "✓" : "✕"}
          </div>

          <h2
            style={{
              margin: "0 0 10px",
            }}
          >
            {result.success
              ? "Product Stored"
              : "Wrong Location"}
          </h2>

          <p>
            {result.message}
          </p>

          {result.success && (
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
                Rack:{" "}
                <strong>
                  {result.rack}
                </strong>
              </p>

              <p>
                Added Quantity:{" "}
                <strong>
                  +{result.added}
                </strong>
              </p>

              <p>
                New Total:{" "}
                <strong>
                  {result.quantity}
                </strong>
              </p>

            </div>
          )}

          <button
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

export default ScanRack