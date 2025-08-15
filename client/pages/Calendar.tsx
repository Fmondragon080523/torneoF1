import { Link } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  CheckCircle,
  Circle,
  Zap,
} from "lucide-react";
import { useData } from "../contexts/DataContext";

export default function Calendar() {
  const { races } = useData();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "next":
        return <Zap className="w-6 h-6 text-f1-red animate-pulse" />;
      default:
        return <Circle className="w-6 h-6 text-f1-white-muted" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle className="w-4 h-4 mr-1" />
            Terminada
          </span>
        );
      case "next":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-f1-red/20 text-f1-red border border-f1-red/30 animate-pulse-red">
            <Zap className="w-4 h-4 mr-1" />
            Próxima
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-f1-dark-border/20 text-f1-white-muted border border-f1-dark-border">
            <Circle className="w-4 h-4 mr-1" />
            Pendiente
          </span>
        );
    }
  };

  const getCardStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500/50 bg-green-500/5 hover:border-green-500";
      case "next":
        return "border-f1-red bg-f1-red/5 hover:border-f1-red-light animate-glow";
      default:
        return "border-f1-dark-border bg-f1-dark-light hover:border-f1-red";
    }
  };

  return (
    <div className="min-h-screen bg-f1-dark f1-grid-bg">
      {/* Navigation */}
      <nav className="border-b border-f1-dark-border bg-f1-dark-light/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fba99a7590f9b48398a4ec4b9a1921475%2F29f6da581e3748eaa63f74cf1fc8b1d3?format=webp&width=800"
                alt="Tournament Logo"
                className="w-8 h-8 rounded-full"
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
                className="text-f1-white hover:text-f1-red transition-colors font-medium"
              >
                Calendario
              </Link>
              <Link
                to="/admin"
                className="text-f1-white-muted hover:text-f1-red transition-colors font-medium"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-f1 text-5xl md:text-6xl font-black text-f1-white mb-4 f1-text-shadow">
            CALENDARIO
          </h1>
          <p className="text-f1-white-muted text-lg font-racing">
            Torneo F1 PS5 Championship • {races.length} carreras programadas
          </p>
        </div>

        {/* Races Grid */}
        <div className="grid gap-6 mb-8">
          {races.map((race, index) => (
            <div
              key={race.id}
              className={`border-2 rounded-lg p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-f1-red/10 cursor-pointer animate-slide-up ${getCardStyle(race.status)}`}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="grid lg:grid-cols-4 gap-6 items-center">
                {/* Race Image */}
                <div className="lg:col-span-1">
                  <div className="relative overflow-hidden rounded-lg bg-f1-dark border border-f1-dark-border">
                    <img
                      src={race.image}
                      alt={race.circuit}
                      className="w-full h-32 object-cover hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2">
                      <span className="text-white text-sm font-medium">
                        {race.country}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Race Info */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-f1 text-2xl font-bold text-f1-white">
                      {race.name}
                    </h3>
                    {getStatusBadge(race.status)}
                  </div>

                  <div className="flex items-center space-x-4 text-f1-white-muted">
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      <span>{race.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{race.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-f1-white">
                    <MapPin className="w-5 h-5 mr-2 text-f1-red" />
                    <span className="font-medium text-lg">{race.circuit}</span>
                  </div>

                  {/* Results for completed races */}
                  {race.status === "completed" && race.winner && (
                    <div className="pt-3 border-t border-f1-dark-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-f1-white-muted text-sm">
                            Ganador:
                          </span>
                          <span className="font-f1 font-bold text-f1-white ml-2">
                            {race.winner}
                          </span>
                        </div>
                        {race.fastestLap && (
                          <div>
                            <span className="text-f1-white-muted text-sm">
                              Vuelta rápida:
                            </span>
                            <span className="font-f1 font-bold text-f1-red ml-2 countdown-digit">
                              {race.fastestLap}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Icon */}
                <div className="lg:col-span-1 flex justify-center lg:justify-end">
                  <div className="text-center">
                    {getStatusIcon(race.status)}
                    <div className="mt-2 text-f1-white-muted text-sm font-medium">
                      {race.status === "completed"
                        ? "Completada"
                        : race.status === "next"
                          ? "Próxima"
                          : "Pendiente"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tournament Info */}
        <div className="bg-f1-dark-light f1-border-glow rounded-lg p-6 mb-8">
          <h2 className="font-f1 text-2xl font-bold text-f1-white mb-4 flex items-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fba99a7590f9b48398a4ec4b9a1921475%2F8c877dcc4c864888b9723b4cfe80a70f?format=webp&width=800"
              alt="Logo"
              className="w-6 h-6 mr-3"
            />
            INFORMACIÓN DEL TORNEO
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-f1-white mb-2">
                Formato del Torneo
              </h3>
              <ul className="space-y-1 text-f1-white-muted">
                <li>• {races.length} carreras programadas</li>
                <li>• Sistema de puntos F1 tradicional</li>
                <li>• Clasificación previa a cada carrera</li>
                <li>• Premios para el podio final</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-f1-white mb-2">
                Reglas Especiales
              </h3>
              <ul className="space-y-1 text-f1-white-muted">
                <li>• Configuración de dificultad: Profesional</li>
                <li>• Clima dinámico activado</li>
                <li>• Daños realistas</li>
                <li>• Sin ayudas de conducción</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-f1-dark-light border border-f1-dark-border rounded-lg p-6 text-center">
            <div className="text-green-500 text-2xl font-f1 font-bold mb-2">
              {races.filter((race) => race.status === "completed").length}
            </div>
            <div className="text-f1-white-muted">Carreras Completadas</div>
          </div>
          <div className="bg-f1-dark-light border border-f1-red rounded-lg p-6 text-center">
            <div className="text-f1-red text-2xl font-f1 font-bold mb-2">
              {races.filter((race) => race.status === "next").length}
            </div>
            <div className="text-f1-white-muted">Próxima Carrera</div>
          </div>
          <div className="bg-f1-dark-light border border-f1-dark-border rounded-lg p-6 text-center">
            <div className="text-f1-white text-2xl font-f1 font-bold mb-2">
              {races.filter((race) => race.status === "upcoming").length}
            </div>
            <div className="text-f1-white-muted">Carreras Pendientes</div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-f1-dark-light border-2 border-f1-red rounded-lg font-f1 font-bold text-f1-white hover:bg-f1-red transition-colors"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fba99a7590f9b48398a4ec4b9a1921475%2F8c877dcc4c864888b9723b4cfe80a70f?format=webp&width=800"
              alt="Logo"
              className="w-5 h-5 mr-2"
            />
            VOLVER AL INICIO
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-f1-dark-border bg-f1-dark-light/50 backdrop-blur-md mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fba99a7590f9b48398a4ec4b9a1921475%2F39f8095c4f4c4966b615c60e68ef70eb?format=webp&width=800"
                alt="Torneo Logo"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="font-f1 text-lg font-bold text-f1-white">
                  TORNEO F1 PS5
                </h3>
                <p className="text-f1-white-muted text-sm">Championship 2024</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-f1-white-muted text-sm">
                © 2024 Torneo F1 PS5. Todos los derechos reservados.
              </p>
              <p className="text-f1-white-muted text-xs mt-1">
                Organizado con ❤️ para la comunidad gaming
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
