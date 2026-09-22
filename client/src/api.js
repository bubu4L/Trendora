const API_URL =
    import.meta.env.VITE_API_URL || "https://trendora-6r7x.onrender.com/api";


// =========================
// PRODUCTS
// =========================

export async function fetchProducts(params = {}) {

    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value) query.set(key, value);
    });

    const response = await fetch(
        `${API_URL}/products?${query.toString()}`
    );

    if (!response.ok) {
        throw new Error("Unable to load products");
    }

    return response.json();
}


export async function fetchProduct(id) {

    const response = await fetch(
        `${API_URL}/products/${id}`
    );

    if (!response.ok) {
        throw new Error("Product not found");
    }

    return response.json();
}


// =========================
// ORDERS
// =========================

export async function createOrder(order) {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/orders`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            ...(token && {
                Authorization: `Bearer ${token}`
            })
        },

        body: JSON.stringify(order)
    });

    if (!response.ok) {
        throw new Error("Unable to create order");
    }

    return response.json();
}


// =========================
// REGISTER
// =========================

export async function registerUser(userData) {

    const response = await fetch(`${API_URL}/auth/register`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Registration failed");
    }

    return data;
}


// =========================
// LOGIN
// =========================

export async function loginUser(credentials) {

    const response = await fetch(`${API_URL}/auth/login`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    return data;
}