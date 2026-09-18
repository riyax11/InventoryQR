function Home({
  onScanProduct,
  onScanRack,
  onScanOut,
  onViewInventory,
  onGenerateQR,
  onGenerateRackQR,
  onProductMaster,
  onRackMaster,
}) {
  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">IQ</div>

          <div>
            <h2>InventoryQR</h2>
            <span>Smart inventory control</span>
          </div>
        </div>

        <div className="status-badge">
          <span className="status-dot"></span>
          System Online
        </div>
      </header>

      <main className="dashboard-content">

        {/* HERO */}
        <section className="welcome-section">
          <div>
            <p className="eyebrow">WAREHOUSE OPERATIONS</p>

            <h1>
              Inventory,
              <br />
              <span>under control.</span>
            </h1>

            <p className="welcome-text">
              Scan products, verify their locations and keep your inventory
              moving accurately.
            </p>
          </div>

          <div className="warehouse-visual">
            <div className="warehouse-icon">▦</div>
          </div>
        </section>


        {/* PRIMARY ACTION */}
        <section className="primary-action">
          <div className="action-icon">⌕</div>

          <div className="action-content">
            <span className="action-label">QUICK ACTION</span>

            <h2>Scan a Product</h2>

            <p>
              Identify a product and verify where it belongs.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={onScanProduct}
          >
            Start Scan →
          </button>
        </section>


        {/* STATS */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-top">
              <span>PRODUCTS</span>
              <span className="stat-symbol">◫</span>
            </div>

            <strong>3</strong>

            <p>Registered products</p>
          </div>


          <div className="stat-card">
            <div className="stat-top">
              <span>LOCATIONS</span>
              <span className="stat-symbol">⌖</span>
            </div>

            <strong>4</strong>

            <p>Active rack locations</p>
          </div>


          <div className="stat-card">
            <div className="stat-top">
              <span>ACCURACY</span>
              <span className="stat-symbol">✓</span>
            </div>

            <strong>100%</strong>

            <p>Location verification</p>
          </div>

        </section>


        {/* OPERATIONS */}
        <section>
          <div className="section-heading">
            <div>
              <p className="eyebrow">OPERATIONS</p>

              <h2>Warehouse workflow</h2>
            </div>
          </div>


          <div className="operations-grid">

            {/* INBOUND */}
            <button
              className="operation-card"
              onClick={onScanProduct}
            >
              <div className="operation-icon inbound">
                ↓
              </div>

              <div>
                <h3>Inbound</h3>

                <p>
                  Receive a product and assign its correct rack.
                </p>
              </div>

              <span className="arrow">→</span>
            </button>


            {/* VERIFY LOCATION */}
            <button
              className="operation-card"
              onClick={onScanRack}
            >
              <div className="operation-icon location">
                ⌖
              </div>

              <div>
                <h3>Verify Location</h3>

                <p>
                  Scan a rack and confirm the product belongs there.
                </p>
              </div>

              <span className="arrow">→</span>
            </button>


            {/* STOCK OUT */}
            <button
              className="operation-card"
              onClick={onScanOut}
            >
              <div className="operation-icon inventory">
                ↑
              </div>

              <div>
                <h3>Stock Out</h3>

                <p>
                  Dispatch products and update available stock.
                </p>
              </div>

              <span className="arrow">→</span>
            </button>


            {/* INVENTORY */}
            <button
              className="operation-card"
              onClick={onViewInventory}
            >
              <div className="operation-icon inventory">
                ▤
              </div>

              <div>
                <h3>Inventory</h3>

                <p>
                  View products, quantities and current locations.
                </p>
              </div>

              <span className="arrow">→</span>
            </button>

          </div>
        </section>


        {/* MASTER DATA */}
        <section className="tools-section">

          <div className="section-heading">
            <div>
              <p className="eyebrow">MASTER DATA</p>

              <h2>Manage Warehouse</h2>
            </div>
          </div>


          <div className="tools-grid">

            <button
              className="tool-button"
              onClick={onProductMaster}
            >
              <span>▤</span>
              Product Master
            </button>


            <button
              className="tool-button"
              onClick={onRackMaster}
            >
              <span>⌗</span>
              Rack Master
            </button>

          </div>
        </section>


        {/* QR TOOLS */}
        <section className="tools-section">

          <div className="section-heading">
            <div>
              <p className="eyebrow">PROTOTYPE TOOLS</p>

              <h2>QR Management</h2>
            </div>
          </div>


          <div className="tools-grid">

            <button
              className="tool-button"
              onClick={onGenerateQR}
            >
              <span>▣</span>
              Generate Product QR
            </button>


            <button
              className="tool-button"
              onClick={onGenerateRackQR}
            >
              <span>⌗</span>
              Generate Rack QR
            </button>

          </div>
        </section>

      </main>


      {/* BOTTOM NAV */}
      <nav className="bottom-nav">

        <button className="nav-item active">
          <span>⌂</span>
          Home
        </button>


        <button
          className="nav-item"
          onClick={onScanProduct}
        >
          <span>⌕</span>
          Scan
        </button>


        <button
          className="nav-item"
          onClick={onViewInventory}
        >
          <span>▤</span>
          Inventory
        </button>

      </nav>

    </div>
  )
}


export default Home