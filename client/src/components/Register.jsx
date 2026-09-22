import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api";

export default function Register({ onLogin }) {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
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

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {

            const data = await registerUser({
                name: form.name,
                email: form.email,
                password: form.password
            });

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
                        JOIN TRENDORA
                    </span>

                    <h1>
                        Create your <em>account.</em>
                    </h1>

                    <p>
                        Create an account to manage your orders
                        and enjoy a better shopping experience.
                    </p>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        <input
                            required
                            name="name"
                            placeholder="Full name"
                            value={form.name}
                            onChange={handleChange}
                        />

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

                        <input
                            required
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={form.confirmPassword}
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
                                ? "Creating account..."
                                : "Create account"}
                        </button>

                    </form>

                    <p className="auth-switch">
                        Already have an account?{" "}
                        <Link to="/login">
                            Login
                        </Link>
                    </p>

                </div>
            </div>
        </section>
    );
}