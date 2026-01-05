import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { getDevAuthPayload, isMockMode } from "../api/service.js";
import { saveAuth } from "./authStore.js";

function LoginPage() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mockMode = isMockMode();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await api.post("/api/auth/login", formState);
      saveAuth(response.data);
      navigate("/app", { replace: true });
    } catch {
      setError("Login failed. Check your email and password and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDevLogin = (role) => {
    try {
      const payload = getDevAuthPayload(role);
      saveAuth(payload);
      navigate("/app", { replace: true });
    } catch (err) {
      console.error("Dev login failed", err);
      setError("Unable to start dev session.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img className="login-logo" src="/logo.png" alt="The GAP Company logo" />
          <h1>Sign in</h1>
          <p className="muted">
            Access The GAP HR dashboards and keep field teams aligned.
          </p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span className="form-label">Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-field">
            <span className="form-label">Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              value={formState.password}
              onChange={handleChange}
              required
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        {mockMode ? (
          <div className="dev-login">
            <p className="muted">Mock mode is active. Jump into a role:</p>
            <div className="dev-login-buttons">
              <button
                type="button"
                className="secondary-button"
                onClick={() => handleDevLogin("HR_ADMIN")}
              >
                Dev Login: HR Admin
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => handleDevLogin("PM")}
              >
                Dev Login: Project Manager
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default LoginPage;
