const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"


// =========================
// PRODUCTS
// =========================

export async function getProducts() {
  const response = await fetch(
    `${API_BASE_URL}/products`
  )

  if (!response.ok) {
    throw new Error("Unable to load products")
  }

  return await response.json()
}


export async function getProduct(barcode) {
  const response = await fetch(
    `${API_BASE_URL}/products/${encodeURIComponent(barcode)}`
  )

  if (!response.ok) {

    if (response.status === 404) {
      throw new Error("Product not registered")
    }

    throw new Error("Unable to connect to backend")
  }

  return await response.json()
}


export async function createProduct(productData) {

  const response = await fetch(
    `${API_BASE_URL}/products`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    }
  )

  const data = await response.json()

  if (!response.ok) {

    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : "Unable to register product"
    )
  }

  return data
}


// =========================
// RACKS
// =========================

export async function getRacks() {

  const response = await fetch(
    `${API_BASE_URL}/racks`
  )

  if (!response.ok) {
    throw new Error("Unable to load racks")
  }

  return await response.json()
}


export async function getRack(rackCode) {

  const response = await fetch(
    `${API_BASE_URL}/racks/${encodeURIComponent(rackCode)}`
  )

  if (!response.ok) {

    if (response.status === 404) {
      throw new Error("Rack not registered")
    }

    throw new Error("Unable to connect to backend")
  }

  return await response.json()
}


export async function createRack(rackData) {

  const response = await fetch(
    `${API_BASE_URL}/racks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rackData),
    }
  )

  const data = await response.json()

  if (!response.ok) {

    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : "Unable to register rack"
    )
  }

  return data
}


// =========================
// INBOUND
// =========================

export async function inboundProduct(
  barcode,
  rackCode,
  quantity
) {

  const response = await fetch(
    `${API_BASE_URL}/inventory/inbound?barcode=${encodeURIComponent(
      barcode
    )}&rack_code=${encodeURIComponent(
      rackCode
    )}&quantity=${encodeURIComponent(
      quantity
    )}`,
    {
      method: "POST",
    }
  )

  const data = await response.json()

  if (!response.ok) {

    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : "Unable to store product"
    )
  }

  return data
}


// =========================
// OUTBOUND
// =========================

export async function outboundProduct(
  barcode,
  quantity
) {

  const response = await fetch(
    `${API_BASE_URL}/inventory/outbound?barcode=${encodeURIComponent(
      barcode
    )}&quantity=${encodeURIComponent(
      quantity
    )}`,
    {
      method: "POST",
    }
  )

  const data = await response.json()

  if (!response.ok) {

    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : "Unable to dispatch product"
    )
  }

  return data
}


// =========================
// INVENTORY
// =========================

export async function getInventory() {

  const response = await fetch(
    `${API_BASE_URL}/inventory`
  )

  if (!response.ok) {
    throw new Error("Unable to load inventory")
  }

  return await response.json()
}


// =========================
// MOVEMENTS
// =========================

export async function getMovements() {

  const response = await fetch(
    `${API_BASE_URL}/movements`
  )

  if (!response.ok) {
    throw new Error("Unable to load movement history")
  }

  return await response.json()
}