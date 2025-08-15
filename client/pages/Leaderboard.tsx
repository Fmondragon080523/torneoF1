import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, Medal, Clock, User, Crown, Star, Zap } from "lucide-react";
import { useData } from "../contexts/DataContext";

export default function Leaderboard() {
  const { drivers } = useData();
  const [showAnimation, setShowAnimation] = useState(false);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-f1-gold" />;
      case 2:
        return <Medal className="w-6 h-6 text-f1-silver" />;
      case 3:
        return <Medal className="w-6 h-6 text-f1-bronze" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-f1-white-muted font-f1 font-bold">
            {position}
          </span>
        );
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return "border-f1-gold bg-f1-gold/5";
      case 2:
        return "border-f1-silver bg-f1-silver/5";
      case 3:
        return "border-f1-bronze bg-f1-bronze/5";
      default:
        return "border-f1-dark-border bg-f1-dark-light";
    }
  };

  // Trigger animation for winner
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Sort drivers by position
  const sortedDrivers = [...drivers].sort((a, b) => a.position - b.position);
  const winner = sortedDrivers[0];

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
                className="text-f1-white hover:text-f1-red transition-colors font-medium"
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
            CLASIFICACIÓN
          </h1>
          <p className="text-f1-white-muted text-lg font-racing">
            Resultados del Torneo F1 PS5 Championship
          </p>
        </div>

        {/* Winner Highlight with Animation */}
        {winner && showAnimation && (
          <div className="mb-8 relative">
            <div className="bg-gradient-to-r from-f1-gold/20 via-f1-gold/30 to-f1-gold/20 border-2 border-f1-gold rounded-lg p-6 relative overflow-hidden animate-slide-up">
              {/* Confetti Effect */}
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-f1-gold animate-bounce"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random()}s`,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Crown className="w-12 h-12 text-f1-gold animate-pulse" />
                    <div className="absolute -top-1 -right-1">
                      <Star className="w-6 h-6 text-f1-gold animate-spin" />
                    </div>
                  </div>
                  <div>
                    <h2 className="font-f1 text-3xl font-black text-f1-white">
                      {winner.name}
                    </h2>
                    <p className="text-f1-gold font-medium">
                      ¡LÍDER DEL CAMPEONATO!
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-f1 text-4xl font-black text-f1-gold countdown-digit">
                    {winner.time}
                  </div>
                  <div className="flex items-center text-f1-gold">
                    {winner.isNewRecord && <Zap className="w-4 h-4 mr-1" />}
                    <span className="font-medium">
                      {winner.isNewRecord ? "Récord" : "Mejor tiempo"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-f1-dark-light rounded-lg overflow-hidden border border-f1-dark-border">
          {/* Table Header */}
          <div className="bg-f1-red px-6 py-4">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-1">
                <span className="font-f1 font-bold text-f1-white text-sm">
                  POS
                </span>
              </div>
              <div className="col-span-5">
                <span className="font-f1 font-bold text-f1-white text-sm">
                  PILOTO
                </span>
              </div>
              <div className="col-span-2">
                <span className="font-f1 font-bold text-f1-white text-sm">
                  EDAD
                </span>
              </div>
              <div className="col-span-2">
                <span className="font-f1 font-bold text-f1-white text-sm">
                  TIEMPO
                </span>
              </div>
              <div className="col-span-2">
                <span className="font-f1 font-bold text-f1-white text-sm">
                  PUNTOS
                </span>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-f1-dark-border">
            {sortedDrivers.map((driver, index) => (
              <div
                key={driver.id}
                className={`px-6 py-4 hover:bg-f1-red/10 transition-colors ${getPositionColor(driver.position)} ${
                  driver.position <= 3 ? "animate-slide-up" : ""
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1 flex items-center">
                    {getPositionIcon(driver.position)}
                  </div>
                  <div className="col-span-5 flex items-center space-x-3">
                    <User className="w-5 h-5 text-f1-white-muted" />
                    <span className="font-racing font-semibold text-f1-white">
                      {driver.name}
                    </span>
                    {driver.isNewRecord && (
                      <div className="flex items-center bg-f1-red/20 text-f1-red px-2 py-1 rounded text-xs font-medium">
                        <Zap className="w-3 h-3 mr-1" />
                        RÉCORD
                      </div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <span className="text-f1-white-muted font-medium">
                      {driver.age}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span
                      className={`font-f1 font-bold ${
                        driver.position === 1
                          ? "text-f1-gold countdown-digit"
                          : "text-f1-white"
                      }`}
                    >
                      {driver.time}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-f1 font-bold text-f1-red">
                      {driver.points}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Podium Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {sortedDrivers.slice(0, 3).map((driver, index) => (
            <div
              key={driver.id}
              className={`text-center p-6 rounded-lg border-2 ${getPositionColor(driver.position)} hover:scale-105 transition-transform`}
            >
              <div className="mb-4">{getPositionIcon(driver.position)}</div>
              <h3 className="font-f1 font-bold text-f1-white text-xl mb-2">
                {driver.name}
              </h3>
              <p className="text-f1-white-muted mb-2">{driver.age} años</p>
              <p
                className={`font-f1 font-bold text-2xl ${
                  index === 0
                    ? "text-f1-gold"
                    : index === 1
                      ? "text-f1-silver"
                      : "text-f1-bronze"
                }`}
              >
                {driver.time}
              </p>
              <p className="text-f1-red font-bold mt-2">{driver.points} pts</p>
              {driver.isNewRecord && (
                <div className="flex items-center justify-center mt-2 text-f1-gold">
                  <Zap className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium">RÉCORD</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
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
