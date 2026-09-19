const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"


export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`)
  return response.json()
}


export async function getProduct(barcode) {
  const response = await fetch(
    `${API_BASE_URL}/products/${barcode}`
  )

  if (!response.ok) {
    throw new Error("Product not found")
  }

  return response.json()
}


export async function createProduct(product) {
  const response = await fetch(
    `${API_BASE_URL}/products`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    }
  )

  if (!response.ok) {
    throw new Error("Failed to create product")
  }

  return response.json()
}


export async function getRacks() {
  const response = await fetch(`${API_BASE_URL}/racks`)
  return response.json()
}


export async function getRack(rackCode) {
  const response = await fetch(
    `${API_BASE_URL}/racks/${rackCode}`
  )

  if (!response.ok) {
    throw new Error("Rack not found")
  }

  return response.json()
}


export async function createRack(rack) {
  const response = await fetch(
    `${API_BASE_URL}/racks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(rack)
    }
  )

  if (!response.ok) {
    throw new Error("Failed to create rack")
  }

  return response.json()
}


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
    )}&quantity=${quantity}`,
    {
      method: "POST"
    }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(
      error.detail || "Inbound operation failed"
    )
  }

  return response.json()
}


export async function outboundProduct(
  barcode,
  quantity
) {
  const response = await fetch(
    `${API_BASE_URL}/inventory/outbound?barcode=${encodeURIComponent(
      barcode
    )}&quantity=${quantity}`,
    {
      method: "POST"
    }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(
      error.detail || "Outbound operation failed"
    )
  }

  return response.json()
}


export async function getInventory() {
  const response = await fetch(
    `${API_BASE_URL}/inventory`
  )

  return response.json()
}


export async function getMovements() {
  const response = await fetch(
    `${API_BASE_URL}/movements`
  )

  return response.json()
}