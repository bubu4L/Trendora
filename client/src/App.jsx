import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fallbackProducts, categories } from "./data";
import { createOrder, fetchProducts } from "./api";
import Login from "./components/Login";
import Register from "./components/Register";

const money = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  });
}

function Layout({ children, cartCount, onCart, user, onLogout }) {
  const location = useLocation();
  const [menu, setMenu] = useState(false);

  // FIX: braces so the effect never returns scrollTo's result to React.
  // Also handles /#categories and /#story links without a full page reload.
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.hash]);

  return (
    <>
      <div className="announcement">
        <div className="container text-center">
          Free delivery on orders over ₦100,000 <span>•</span> New season, new
          energy.
        </div>
      </div>
      <nav className="navbar navbar-expand-lg trendora-nav sticky-top">
        <div className="container">
          <Link className="navbar-brand brand" to="/">
            trendora<span>.</span>
          </Link>
          <button
            className="navbar-toggler"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle navigation"
          >
            <i className={`bi ${menu ? "bi-x-lg" : "bi-list"}`}></i>
          </button>
          <div className={`navbar-collapse ${menu ? "show" : ""}`}>
            <ul className="navbar-nav mx-auto gap-lg-4">
              <li>
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="nav-link" to="/shop">
                  Shop
                </Link>
              </li>
              <li>
                <Link className="nav-link" to="/#categories">
                  Categories
                </Link>
              </li>
              <li>
                <Link className="nav-link" to="/#story">
                  Our Story
                </Link>
              </li>
            </ul>
            <div className="nav-actions">
              <button className="icon-btn">
                <i className="bi bi-search"></i>
              </button>

              {user ? (
                <div className="user-menu">
                  <button className="icon-btn">
                    <i className="bi bi-person-fill"></i>
                  </button>

                  <span className="user-name">{user.name}</span>

                  <button className="logout-btn" onClick={onLogout}>
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="icon-btn" title="Login">
                  <i className="bi bi-person"></i>
                </Link>
              )}

              <button className="icon-btn cart-btn" onClick={onCart}>
                <i className="bi bi-bag"></i>
                <span>{cartCount}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
      <footer className="footer">
        <div className="container">
          <div className="row gy-5">
            <div className="col-lg-4">
              <div className="brand footer-brand">
                trendora<span>.</span>
              </div>
              <p className="footer-copy">
                Thoughtfully curated fashion and lifestyle pieces for people who
                like their everyday a little more considered.
              </p>
              <div className="socials">
                <a href="#">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="#">
                  <i className="bi bi-tiktok"></i>
                </a>
                <a href="#">
                  <i className="bi bi-facebook"></i>
                </a>
              </div>
            </div>
            <div className="col-6 col-lg-2">
              <h6>Shop</h6>
              <Link to="/shop">New arrivals</Link>
              <Link to="/shop">Best sellers</Link>
              <Link to="/shop">Fashion</Link>
              <Link to="/shop">Lifestyle</Link>
            </div>
            <div className="col-6 col-lg-2">
              <h6>Help</h6>
              <a href="#">Delivery</a>
              <a href="#">Returns</a>
              <a href="#">Contact</a>
              <a href="#">FAQs</a>
            </div>
            <div className="col-lg-4">
              <h6>Stay in the loop</h6>
              <p className="small text-secondary">
                Get first access to drops, private edits and occasional good
                news.
              </p>
              <div className="newsletter">
                <input placeholder="Your email address" type="email" />
                <button>Join</button>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Trendora. All rights reserved.</span>
            <span>Made for modern living.</span>
          </div>
        </div>
      </footer>
    </>
  );
}

function ProductCard({ product, onAdd }) {
  return (
    <motion.div
      className="product-card"
      whileHover={{ y: -7 }}
      transition={{ duration: 0.25 }}
    >
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} />
        <span className="product-badge">{product.badge}</span>
        <button className="heart-btn">
          <i className="bi bi-heart"></i>
        </button>
        <button className="quick-add" onClick={() => onAdd(product)}>
          Add to bag <i className="bi bi-arrow-up-right"></i>
        </button>
      </div>
      <div className="product-info">
        <div className="d-flex justify-content-between gap-2">
          <div>
            <span className="eyebrow">{product.category}</span>
            <h3>{product.name}</h3>
          </div>
          <span className="rating">
            <i className="bi bi-star-fill"></i> {product.rating}
          </span>
        </div>
        <div className="price">
          {money(product.price)}{" "}
          {product.oldPrice && <del>{money(product.oldPrice)}</del>}
        </div>
      </div>
    </motion.div>
  );
}

function Home({ onAdd }) {
  useReveal();
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="eyebrow light">THE NEW EVERYDAY</span>
              <h1>
                Style that feels
                <br />
                <em>like you.</em>
              </h1>
              <p>
                Curated fashion, accessories and lifestyle pieces made for the
                way you live now.
              </p>
              <Link className="btn btn-light hero-btn" to="/shop">
                Explore the edit <i className="bi bi-arrow-up-right"></i>
              </Link>
            </motion.div>
          </div>
          <div className="hero-meta">
            <span>01 / 03</span>
            <div className="hero-line"></div>
            <span>New season</span>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container">
          <div className="row g-4">
            <div className="col-6 col-lg-3">
              <i className="bi bi-box-seam"></i>
              <span>Nationwide delivery</span>
            </div>
            <div className="col-6 col-lg-3">
              <i className="bi bi-shield-check"></i>
              <span>Secure checkout</span>
            </div>
            <div className="col-6 col-lg-3">
              <i className="bi bi-arrow-repeat"></i>
              <span>Easy returns</span>
            </div>
            <div className="col-6 col-lg-3">
              <i className="bi bi-headset"></i>
              <span>Personal support</span>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="section-pad">
        <div className="container">
          <div className="section-heading reveal">
            <div>
              <span className="eyebrow">SHOP BY MOOD</span>
              <h2>
                Find your <em>thing.</em>
              </h2>
            </div>
            <Link to="/shop" className="text-link">
              View all <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="category-grid reveal">
            {categories.map((c, i) => (
              <Link
                to={`/shop?category=${encodeURIComponent(c.name)}`}
                className="category-card"
                key={c.name}
              >
                <img src={c.image} alt={c.name} />
                <div className="category-overlay">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <h3>{c.name}</h3>
                  <i className="bi bi-arrow-up-right"></i>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad soft-bg">
        <div className="container">
          <div className="section-heading reveal">
            <div>
              <span className="eyebrow">THE LATEST</span>
              <h2>
                Trending <em>now.</em>
              </h2>
            </div>
            <Link to="/shop" className="text-link">
              Shop everything <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="row g-4">
            {fallbackProducts.slice(0, 4).map((p) => (
              <div className="col-12 col-sm-6 col-lg-3 reveal" key={p.id}>
                <ProductCard product={p} onAdd={onAdd} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="story section-pad">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 reveal">
              <div className="story-image">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85"
                  alt="Trendora store"
                />
              </div>
            </div>
            <div className="col-lg-5 offset-lg-1 reveal">
              <span className="eyebrow">WHY TRENDORA</span>
              <h2>
                Less noise.
                <br />
                <em>More you.</em>
              </h2>
              <p>
                We believe shopping should feel inspiring, not overwhelming.
                Trendora brings together pieces with personality — from what you
                wear to how you live.
              </p>
              <p>
                Every collection is selected with versatility, quality and
                modern style in mind.
              </p>
              <Link className="btn btn-dark mt-2" to="/shop">
                Discover Trendora <i className="bi bi-arrow-up-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial">
        <div className="container-fluid px-0">
          <div className="editorial-inner">
            <div className="editorial-copy">
              <span className="eyebrow light">TRENDORA EDIT</span>
              <h2>
                Make room for
                <br />
                <em>what matters.</em>
              </h2>
              <Link className="btn btn-light" to="/shop">
                Shop the edit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Shop({ onAdd }) {
  useReveal();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState(fallbackProducts);
  const [category, setCategory] = useState(
    searchParams.get("category") || "All",
  );
  const [search, setSearch] = useState("");

  // FIX: the category cards on Home link to /shop?category=..., so read it here.
  useEffect(() => {
    setCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((data) => {
        if (!cancelled && Array.isArray(data.products) && data.products.length)
          setProducts(data.products);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "All" || p.category === category) &&
          p.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [products, category, search],
  );

  return (
    <section className="shop-page section-pad">
      <div className="container">
        <div className="shop-head">
          <div>
            <span className="eyebrow">THE COLLECTION</span>
            <h1>
              Shop <em>everything.</em>
            </h1>
          </div>
          <p>Thoughtful pieces for every part of your day.</p>
        </div>
        <div className="shop-tools">
          <div className="filters">
            {["All", ...categories.map((c) => c.name)].map((c) => (
              <button
                className={category === c ? "active" : ""}
                onClick={() => setCategory(c)}
                key={c}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
            />
          </div>
        </div>
        <div className="row g-4">
          {filtered.map((p) => (
            <div className="col-12 col-sm-6 col-lg-3 reveal" key={p.id}>
              <ProductCard product={p} onAdd={onAdd} />
            </div>
          ))}
        </div>
        {!filtered.length && (
          <div className="empty-state">
            <i className="bi bi-search"></i>
            <h3>No pieces found</h3>
            <p>Try another search or category.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function Checkout({ cart, onComplete }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const total = cart.reduce((sum, p) => sum + p.price, 0);

  // FIX: only clear the cart and show the success page if the order actually succeeded.
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createOrder({
        customer: form,
        items: cart.map((p) => ({
          product: p.id,
          name: p.name,
          price: p.price,
        })),
        total,
      });
      onComplete();
      navigate("/success");
    } catch (err) {
      setError("We could not place your order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!cart.length)
    return (
      <div className="empty-state section-pad">
        <i className="bi bi-bag"></i>
        <h2>Your bag is empty</h2>
        <Link className="btn btn-dark" to="/shop">
          Continue shopping
        </Link>
      </div>
    );

  return (
    <section className="section-pad checkout">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-7">
            <span className="eyebrow">CHECKOUT</span>
            <h1>
              Complete your <em>order.</em>
            </h1>
            <form onSubmit={submit} className="checkout-form">
              <input
                required
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                required
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                required
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <textarea
                required
                placeholder="Delivery address"
                rows="4"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              {error && <p className="text-danger small">{error}</p>}
              <button disabled={loading} className="btn btn-dark w-100">
                {loading ? "Processing..." : `Place order • ${money(total)}`}
              </button>
            </form>
          </div>
          <div className="col-lg-4 offset-lg-1">
            <div className="order-summary">
              <span className="eyebrow">YOUR BAG</span>
              {cart.map((p, i) => (
                <div className="summary-item" key={`${p.id}-${i}`}>
                  <img src={p.image} alt="" />
                  <div>
                    <strong>{p.name}</strong>
                    <small>{p.category}</small>
                  </div>
                  <span>{money(p.price)}</span>
                </div>
              ))}
              <div className="summary-total">
                <span>Total</span>
                <strong>{money(total)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Success() {
  return (
    <div className="success-page section-pad text-center">
      <div className="success-icon">
        <i className="bi bi-check2"></i>
      </div>
      <span className="eyebrow">ORDER RECEIVED</span>
      <h1>You're all set.</h1>
      <p>
        Thanks for shopping with Trendora. Your order has been received and
        we'll be in touch shortly.
      </p>
      <Link className="btn btn-dark" to="/shop">
        Continue shopping
      </Link>
    </div>
  );
}

function App() {
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser && savedUser !== "undefined"
        ? JSON.parse(savedUser)
        : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  });

  const navigate = useNavigate();

  function handleLogin(userData) {
    setUser(userData);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/");
  }

  // FIX: toast timer now lives in an effect with cleanup, so quick repeated adds don't clear each other early.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const add = (product) => {
    setCart((c) => [...c, product]);
    setToast(`${product.name} added to your bag`);
  };

  return (
    <Layout
      cartCount={cart.length}
      onCart={() => navigate("/checkout")}
      user={user}
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/" element={<Home onAdd={add} />} />
        <Route path="/shop" element={<Shop onAdd={add} />} />
        <Route
          path="/checkout"
          element={<Checkout cart={cart} onComplete={() => setCart([])} />}
        />
        <Route path="/success" element={<Success />} />
      </Routes>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast-trendora"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <i className="bi bi-check-circle-fill"></i>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default App;
