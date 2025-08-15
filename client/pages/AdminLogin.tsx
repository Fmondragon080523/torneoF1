import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdmin } from "../contexts/AdminContext";
import { Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(username, password);

    if (success) {
      navigate("/admin/dashboard");
    } else {
      setError("Credenciales incorrectas");
      setUsername("");
      setPassword("");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-f1-dark f1-grid-bg flex items-center justify-center">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 border-b border-f1-dark-border bg-f1-dark-light/50 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fba99a7590f9b48398a4ec4b9a1921475%2F8c877dcc4c864888b9723b4cfe80a70f?format=webp&width=800"
                alt="Tournament Logo"
                className="w-8 h-8"
              />
              <span className="font-f1 text-xl font-bold text-f1-white">
                F1 PS5
              </span>
            </div>
            <div className="flex space-x-6">
              <Link
                to="/"
                className="text-f1-white-muted hover:text-f1-red transition-colors font-medium"
              >
                Inicio
              </Link>
              <Link
                to="/leaderboard"
                className="text-f1-white-muted hover:text-f1-red transition-colors font-medium"
              >
                Clasificación
              </Link>
              <Link
                to="/calendar"
                className="text-f1-white-muted hover:text-f1-red transition-colors font-medium"
              >
                Calendario
              </Link>
              <Link
                to="/admin"
                className="text-f1-white hover:text-f1-red transition-colors font-medium"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-md mx-auto px-4 mt-16">
        <div className="bg-f1-dark-light f1-border-glow rounded-lg p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-f1-red/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-f1-red/20 rounded-full mb-4">
                <Lock className="w-8 h-8 text-f1-red" />
              </div>
              <h1 className="font-f1 text-3xl font-bold text-f1-white mb-2">
                PANEL ADMIN
              </h1>
              <p className="text-f1-white-muted">
                Acceso restringido al sistema de administración
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-f1-red/20 border border-f1-red/50 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 text-f1-red mr-3" />
                <span className="text-f1-red font-medium">{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-f1-white font-medium mb-2">
                  Usuario
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-f1-white-muted" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-f1-dark border border-f1-dark-border rounded-lg text-f1-white placeholder-f1-white-muted focus:border-f1-red focus:outline-none focus:ring-2 focus:ring-f1-red/20 transition-colors"
                    placeholder="Ingresa tu usuario"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-f1-white font-medium mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-f1-white-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-f1-dark border border-f1-dark-border rounded-lg text-f1-white placeholder-f1-white-muted focus:border-f1-red focus:outline-none focus:ring-2 focus:ring-f1-red/20 transition-colors"
                    placeholder="Ingresa tu contraseña"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-f1-white-muted hover:text-f1-white transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 f1-gradient rounded-lg font-f1 font-bold text-f1-white hover:scale-105 transition-transform shadow-lg hover:shadow-f1-red/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-f1-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  "INICIAR SESIÓN"
                )}
              </button>
            </form>

            {/* Helper Text */}
            <div className="mt-6 text-center">
              <p className="text-f1-white-muted text-sm">
                Solo personal autorizado puede acceder
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center text-f1-white-muted hover:text-f1-red transition-colors font-medium"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
