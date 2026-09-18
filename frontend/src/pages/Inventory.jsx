import { useEffect, useState } from "react"
import { getInventory, getMovements } from "../services/api"

function Inventory({ onBack }) {
  const [inventory, setInventory] = useState([])
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadInventory() {
    try {
      setLoading(true)
      setError("")

      const [inventoryData, movementData] = await Promise.all([
        getInventory(),
        getMovements(),
      ])

      setInventory(inventoryData)
      setMovements(movementData)
    } catch (err) {
      console.error("Inventory loading error:", err)

      setError(
        err.message || "Unable to load inventory."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInventory()
  }, [])

  // Backend stores movement timestamps in UTC.
  // Add the UTC marker so the browser converts them
  // correctly to the user's local timezone (IST).
  function formatMovementTime(timestamp) {
    if (!timestamp) {
      return ""
    }

    const utcTimestamp = timestamp.endsWith("Z")
      ? timestamp
      : `${timestamp}Z`

    return new Date(utcTimestamp).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    })
  }

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
          INVENTORY
        </p>

        <h1>
          Inventory
        </h1>

        <p className="page-subtitle">
          View current stock, rack locations and movement history.
        </p>

      </div>

      {loading && (
        <div className="info-card">
          Loading inventory...
        </div>
      )}

      {error && (
        <div
          className="error-card"
          style={{ marginBottom: "18px" }}
        >
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                CURRENT STOCK
              </p>

              <h2>
                Products
              </h2>
            </div>
          </div>

          {inventory.length === 0 ? (
            <div className="info-card">
              <h3>
                No inventory yet
              </h3>

              <p
                style={{
                  color: "#9aa8bc",
                  marginBottom: 0,
                }}
              >
                Complete an inbound scan to add products
                to inventory.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              {inventory.map((item, index) => (
                <div
                  key={item.id || item.barcode || index}
                  className="info-card"
                  style={{
                    margin: 0,
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "15px",
                      alignItems: "flex-start",
                    }}
                  >

                    <div>
                      <h3
                        style={{
                          margin: "0 0 6px",
                        }}
                      >
                        {item.name}
                      </h3>

                      <p
                        style={{
                          margin: "4px 0",
                          color: "#9aa8bc",
                        }}
                      >
                        SKU: {item.sku}
                      </p>

                      <p
                        style={{
                          margin: "4px 0",
                          color: "#9aa8bc",
                        }}
                      >
                        Barcode: {item.barcode}
                      </p>
                    </div>

                    <div
                      style={{
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          color: "#79e2a8",
                          fontSize: "24px",
                          fontWeight: "700",
                        }}
                      >
                        {item.quantity}
                      </div>

                      <div
                        style={{
                          color: "#71809a",
                          fontSize: "12px",
                        }}
                      >
                        units
                      </div>
                    </div>

                  </div>

                  <div
                    style={{
                      marginTop: "15px",
                      padding: "12px",
                      background: "#0b1220",
                      border: "1px solid #253047",
                      borderRadius: "10px",
                    }}
                  >

                    <div
                      style={{
                        color: "#71809a",
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.7px",
                        marginBottom: "5px",
                      }}
                    >
                      Current Location
                    </div>

                    <strong>
                      {item.current_location ||
                        item.expected_rack ||
                        "Not assigned"}
                    </strong>

                  </div>

                </div>
              ))}
            </div>
          )}

          <div
            style={{
              marginTop: "30px",
            }}
          >

            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  MOVEMENT HISTORY
                </p>

                <h2>
                  Recent Activity
                </h2>
              </div>
            </div>

            {movements.length === 0 ? (
              <div className="info-card">
                <p
                  style={{
                    color: "#9aa8bc",
                    margin: 0,
                  }}
                >
                  No movements recorded yet.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "10px",
                }}
              >
                {movements.map((movement, index) => (
                  <div
                    key={movement.id || index}
                    className="info-card"
                    style={{
                      margin: 0,
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "12px",
                      }}
                    >

                      <div>
                        <strong>
                          {movement.product_name}
                        </strong>

                        <p
                          style={{
                            color: "#9aa8bc",
                            margin: "5px 0",
                          }}
                        >
                          {movement.movement_type}
                        </p>

                        {movement.rack_code && (
                          <p
                            style={{
                              color: "#9aa8bc",
                              margin: "5px 0",
                            }}
                          >
                            Rack:{" "}
                            <strong>
                              {movement.rack_code}
                            </strong>
                          </p>
                        )}
                      </div>

                      <div
                        style={{
                          color: "#71809a",
                          fontSize: "12px",
                          textAlign: "right",
                        }}
                      >
                        {formatMovementTime(
                          movement.timestamp
                        )}
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </>
      )}

    </div>
  )
}

export default Inventory