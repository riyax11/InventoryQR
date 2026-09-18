import { useState } from "react"

import Home from "./pages/Home"
import ScanProduct from "./pages/ScanProduct"
import ScanRack from "./pages/ScanRack"
import ScanOut from "./pages/ScanOut"

import ProductMaster from "./pages/ProductMaster"
import RackMaster from "./pages/RackMaster"

import GenerateQR from "./pages/GenerateQR"
import GenerateRackQR from "./pages/GenerateRackQR"

import Inventory from "./pages/Inventory"


function App() {

  const [page, setPage] = useState("home")

  const [selectedProduct, setSelectedProduct] =
    useState(null)


  // =========================
  // SCAN PRODUCT
  // =========================

  function openScanProduct() {

    setSelectedProduct(null)

    setPage("scan-product")
  }


  function handleProductFound(product) {

    setSelectedProduct(product)

    setPage("scan-rack")
  }


  // =========================
  // HOME
  // =========================

  function goHome() {

    setSelectedProduct(null)

    setPage("home")
  }


  // =========================
  // HOME PAGE
  // =========================

  if (page === "home") {

    return (
      <Home

        onScanProduct={openScanProduct}


        onScanRack={() =>
          setPage("scan-product")
        }


        onScanOut={() =>
          setPage("scan-out")
        }


        onViewInventory={() =>
          setPage("inventory")
        }


        onProductMaster={() =>
          setPage("product-master")
        }


        onRackMaster={() =>
          setPage("rack-master")
        }


        onGenerateQR={() =>
          setPage("generate-qr")
        }


        onGenerateRackQR={() =>
          setPage("generate-rack-qr")
        }

      />
    )
  }


  // =========================
  // SCAN PRODUCT
  // =========================

  if (page === "scan-product") {

    return (
      <ScanProduct

        onBack={goHome}

        onProductFound={handleProductFound}

      />
    )
  }


  // =========================
  // RACK VERIFICATION
  // =========================

  if (page === "scan-rack") {

    if (!selectedProduct) {

      return (
        <Home

          onScanProduct={openScanProduct}

          onScanRack={() =>
            setPage("scan-product")
          }

          onScanOut={() =>
            setPage("scan-out")
          }

          onViewInventory={() =>
            setPage("inventory")
          }

          onProductMaster={() =>
            setPage("product-master")
          }

          onRackMaster={() =>
            setPage("rack-master")
          }

          onGenerateQR={() =>
            setPage("generate-qr")
          }

          onGenerateRackQR={() =>
            setPage("generate-rack-qr")
          }

        />
      )
    }


    return (
      <ScanRack

        product={selectedProduct}

        onBack={() =>
          setPage("scan-product")
        }

      />
    )
  }


  // =========================
  // STOCK OUT
  // =========================

  if (page === "scan-out") {

    return (
      <ScanOut

        onBack={goHome}

      />
    )
  }


  // =========================
  // PRODUCT MASTER
  // =========================

  if (page === "product-master") {

    return (
      <ProductMaster

        onBack={goHome}

      />
    )
  }


  // =========================
  // RACK MASTER
  // =========================

  if (page === "rack-master") {

    return (
      <RackMaster

        onBack={goHome}

      />
    )
  }


  // =========================
  // PRODUCT QR GENERATOR
  // =========================

  if (page === "generate-qr") {

    return (
      <GenerateQR

        onBack={goHome}

      />
    )
  }


  // =========================
  // RACK QR GENERATOR
  // =========================

  if (page === "generate-rack-qr") {

    return (
      <GenerateRackQR

        onBack={goHome}

      />
    )
  }


  // =========================
  // INVENTORY
  // =========================

  if (page === "inventory") {

    return (
      <Inventory

        onBack={goHome}

      />
    )
  }


  return null
}


export default App