import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api";

export default function Login({ onLogin }) {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const data = await loginUser(form);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            onLogin(data.user);

            navigate("/");

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);

        }
    }

    return (
        <section className="section-pad">
            <div className="container">
                <div className="auth-container">

                    <span className="eyebrow">
                        WELCOME BACK
                    </span>

                    <h1>
                        Login to <em>Trendora.</em>
                    </h1>

                    <p>
                        Welcome back. Enter your details
                        to continue shopping.
                    </p>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        <input
                            required
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={handleChange}
                        />

                        <input
                            required
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                        />

                        {error && (
                            <p className="text-danger">
                                {error}
                            </p>
                        )}

                        <button
                            disabled={loading}
                            className="btn btn-dark w-100"
                        >
                            {loading
                                ? "Logging in..."
                                : "Login"}
                        </button>

                    </form>

                    <p className="auth-switch">
                        Don't have an account?{" "}
                        <Link to="/register">
                            Create one
                        </Link>
                    </p>

                </div>
            </div>
        </section>
    );
}