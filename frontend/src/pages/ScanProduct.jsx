import { useEffect, useRef, useState } from "react"
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode"

import { getProduct } from "../services/api"


function ScanProduct({ onBack, onProductFound }) {
  const [scannedCode, setScannedCode] = useState("")
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState("1")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [scannerStarted, setScannerStarted] = useState(false)

  const scannerRef = useRef(null)
  const isScanningRef = useRef(false)
  const scanHandledRef = useRef(false)


  // =========================
  // CLEANUP
  // =========================

  useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [])


  // =========================
  // START CAMERA
  // =========================

  async function startScanner() {
    try {
      setError("")
      setProduct(null)
      setScannedCode("")
      setQuantity("1")
      scanHandledRef.current = false

      if (isScanningRef.current) {
        return
      }

      const scanner = new Html5Qrcode("product-reader")

      scannerRef.current = scanner
      isScanningRef.current = true
      setScannerStarted(true)

      await scanner.start(
        {
          facingMode: "environment",
        },
        {
          fps: 10,

          // Wider area so long 1D barcodes can be detected.
          qrbox: {
            width: 320,
            height: 180,
          },

          // Support both QR codes and normal product barcodes.
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.ITF,
          ],
        },

        async (decodedText) => {
          if (!isScanningRef.current) {
            return
          }

          if (scanHandledRef.current) {
            return
          }

          scanHandledRef.current = true

          console.log("PRODUCT CODE DETECTED:", decodedText)

          await handleScan(decodedText)
        },

        () => {}
      )

    } catch (err) {
      console.error(err)

      isScanningRef.current = false
      setScannerStarted(false)

      setError(
        "Unable to access camera. Please allow camera permission."
      )
    }
  }


  // =========================
  // STOP CAMERA
  // =========================

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
      console.log(
        "Scanner cleanup:",
        err
      )
    }

    scannerRef.current = null
    setScannerStarted(false)
  }


  // =========================
  // PRODUCT SCAN
  // =========================

  async function handleScan(code) {
    await stopScanner()

    setScannedCode(code)

    try {
      setLoading(true)
      setError("")

      const productData =
        await getProduct(code)

      // Do NOT move to Rack Verification here.
      // User must enter quantity first.

      setProduct(productData)

    } catch (err) {
      setProduct(null)

      setError(
        err.message ||
        "Product not registered"
      )
    } finally {
      setLoading(false)
    }
  }


  // =========================
  // CONTINUE TO RACK
  // =========================

  function handleContinue() {
    if (!product) {
      setError(
        "Please scan a product first."
      )

      return
    }

    const qty = Number(quantity)

    if (
      !Number.isInteger(qty) ||
      qty <= 0
    ) {
      setError(
        "Please enter a valid quantity."
      )

      return
    }

    setError("")

    if (onProductFound) {
      onProductFound({
        ...product,
        inboundQuantity: qty,
      })
    }
  }


  // =========================
  // RENDER
  // =========================

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
          INBOUND
        </p>

        <h1>
          Scan Product
        </h1>

        <p className="page-subtitle">
          Scan the product barcode to identify
          the item.
        </p>

      </div>


      {/* =========================
          SCANNER
      ========================= */}

      {!product && (
        <>
          <div
            id="product-reader"
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
            Point your camera at the product
            barcode / QR.
          </div>
        </>
      )}


      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div className="info-card">
          Checking product...
        </div>
      )}


      {/* =========================
          ERROR
      ========================= */}

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


      {/* =========================
          SCANNED CODE
      ========================= */}

      {scannedCode &&
        !product &&
        !loading && (
          <div className="info-card">

            <strong>
              Scanned Code
            </strong>

            <p>
              {scannedCode}
            </p>

          </div>
        )}


      {/* =========================
          PRODUCT FOUND
      ========================= */}

      {product && (
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
              margin: "4px 0",
              color: "#9aa8bc",
            }}
          >
            SKU: {product.sku}
          </p>


          <p
            style={{
              margin: "4px 0",
              color: "#9aa8bc",
            }}
          >
            Barcode: {product.barcode}
          </p>


          {/* =========================
              QUANTITY
          ========================= */}

          <div
            style={{
              marginTop: "20px",
            }}
          >

            <label>
              Quantity received
            </label>

            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px",
                marginTop: "8px",
                borderRadius: "10px",
                border:
                  "1px solid #2c3950",
                background: "#0b1220",
                color: "white",
                fontSize: "18px",
              }}
            />

          </div>


          {/* =========================
              EXPECTED LOCATION
          ========================= */}

          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              borderRadius: "12px",
              background: "#0b1220",
              border:
                "1px solid #253047",
            }}
          >

            <div
              style={{
                color: "#8b9bb4",
                fontSize: "12px",
                textTransform:
                  "uppercase",
                letterSpacing: "0.8px",
              }}
            >
              Expected Location
            </div>


            <div
              style={{
                marginTop: "6px",
                fontSize: "17px",
                fontWeight: "600",
              }}
            >
              {product.expected_rack}
            </div>

          </div>


          {/* =========================
              CONTINUE
          ========================= */}

          <button
            onClick={handleContinue}
            className="primary-button"
            style={{
              width: "100%",
              marginTop: "18px",
            }}
          >
            Continue to Rack Verification →
          </button>

        </div>
      )}

    </div>
  )
}


export default ScanProduct