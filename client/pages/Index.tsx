import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, Clock, Calendar, Users, Zap } from "lucide-react";
import { useData } from "../contexts/DataContext";

export default function Index() {
  const { drivers, races, siteContent } = useData();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Get next race date from context
  const nextRaceDate = new Date(siteContent.nextRaceDate);

  // Get last race winner from context or find the most recent completed race
  const getLastRaceWinner = () => {
    const completedRaces = races.filter((race) => race.status === "completed");
    if (completedRaces.length > 0) {
      const lastRace = completedRaces[completedRaces.length - 1];
      return {
        name: lastRace.winner || siteContent.lastRaceWinner,
        time: lastRace.fastestLap || siteContent.lastRaceTime,
        circuit: lastRace.circuit || siteContent.lastRaceCircuit,
        hasNewRecord: true,
      };
    }

    // Fallback to context data
    return {
      name: siteContent.lastRaceWinner,
      time: siteContent.lastRaceTime,
      circuit: siteContent.lastRaceCircuit,
      hasNewRecord: siteContent.showWinnerAnimation,
    };
  };

  const lastRaceWinner = getLastRaceWinner();

  // Get next race info
  const getNextRaceInfo = () => {
    const nextRace = races.find((race) => race.status === "next");
    if (nextRace) {
      return {
        name: nextRace.name,
        circuit: nextRace.circuit,
        date: nextRace.date,
      };
    }

    // Fallback to context data
    return {
      name: siteContent.nextRaceName,
      circuit: siteContent.nextRaceCircuit,
      date: siteContent.nextRaceName.split(" - ")[0] || "Próxima carrera",
    };
  };

  const nextRaceInfo = getNextRaceInfo();

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = nextRaceDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextRaceDate]);

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
                className="text-f1-white hover:text-f1-red transition-colors font-medium"
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
                className="text-f1-white-muted hover:text-f1-red transition-colors font-medium"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-f1 text-6xl md:text-8xl font-black text-f1-white mb-4 f1-text-shadow">
            {siteContent.heroTitle}
          </h1>
          <div className="inline-block f1-gradient px-8 py-3 rounded-lg">
            <p className="font-f1 text-2xl md:text-3xl font-bold text-f1-white">
              {siteContent.heroSubtitle}
            </p>
          </div>
          <p className="text-f1-white-muted text-lg mt-4 font-racing">
            {siteContent.tournamentDates} • {siteContent.tournamentDescription}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Last Race Section */}
          <div className="bg-f1-dark-light f1-border-glow rounded-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-f1-red/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <Trophy className="w-6 h-6 text-f1-gold mr-3" />
                <h2 className="font-f1 text-2xl font-bold text-f1-white">
                  ÚLTIMA CARRERA
                </h2>
              </div>

              {lastRaceWinner.hasNewRecord && (
                <div className="mb-4 inline-flex items-center bg-f1-red/20 text-f1-red px-3 py-1 rounded-full text-sm font-medium animate-pulse-red">
                  <Zap className="w-4 h-4 mr-1" />
                  ¡NUEVO RÉCORD!
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-f1-white-muted">Ganador:</span>
                  <span className="font-f1 text-f1-white font-bold">
                    {lastRaceWinner.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-f1-white-muted">Tiempo:</span>
                  <span className="font-f1 text-f1-red font-bold text-xl countdown-digit">
                    {lastRaceWinner.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-f1-white-muted">Circuito:</span>
                  <span className="text-f1-white font-medium">
                    {lastRaceWinner.circuit}
                  </span>
                </div>
              </div>

              {lastRaceWinner.hasNewRecord && (
                <div className="mt-4 pt-4 border-t border-f1-dark-border">
                  <div className="flex items-center justify-center space-x-2 text-f1-gold animate-glow">
                    <Trophy className="w-5 h-5" />
                    <span className="font-f1 font-bold">
                      RÉCORD DEL CIRCUITO
                    </span>
                    <Trophy className="w-5 h-5" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Next Race Countdown */}
          <div className="bg-f1-dark-light f1-border-glow rounded-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-f1-red/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-f1-red mr-3" />
                <h2 className="font-f1 text-2xl font-bold text-f1-white">
                  PRÓXIMA CARRERA
                </h2>
              </div>

              <div className="text-center mb-6">
                <p className="text-f1-white-muted mb-2">
                  {nextRaceInfo.name} - {nextRaceInfo.circuit}
                </p>
                <p className="text-f1-white font-medium">{nextRaceInfo.date}</p>
              </div>

              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-f1-dark/50 rounded-lg p-3">
                  <div className="countdown-digit text-3xl text-f1-red">
                    {timeLeft.days}
                  </div>
                  <div className="text-f1-white-muted text-sm font-medium">
                    DÍAS
                  </div>
                </div>
                <div className="bg-f1-dark/50 rounded-lg p-3">
                  <div className="countdown-digit text-3xl text-f1-red">
                    {timeLeft.hours}
                  </div>
                  <div className="text-f1-white-muted text-sm font-medium">
                    HORAS
                  </div>
                </div>
                <div className="bg-f1-dark/50 rounded-lg p-3">
                  <div className="countdown-digit text-3xl text-f1-red">
                    {timeLeft.minutes}
                  </div>
                  <div className="text-f1-white-muted text-sm font-medium">
                    MIN
                  </div>
                </div>
                <div className="bg-f1-dark/50 rounded-lg p-3">
                  <div className="countdown-digit text-3xl text-f1-red">
                    {timeLeft.seconds}
                  </div>
                  <div className="text-f1-white-muted text-sm font-medium">
                    SEG
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-f1-dark-light border border-f1-dark-border rounded-lg p-6 text-center group hover:border-f1-red transition-colors">
            <Users className="w-12 h-12 text-f1-red mx-auto mb-3 group-hover:animate-pulse" />
            <div className="font-f1 text-3xl font-bold text-f1-white mb-1">
              {drivers.length}
            </div>
            <div className="text-f1-white-muted">Pilotos</div>
          </div>
          <div className="bg-f1-dark-light border border-f1-dark-border rounded-lg p-6 text-center group hover:border-f1-red transition-colors">
            <Calendar className="w-12 h-12 text-f1-red mx-auto mb-3 group-hover:animate-pulse" />
            <div className="font-f1 text-3xl font-bold text-f1-white mb-1">
              {races.length}
            </div>
            <div className="text-f1-white-muted">Carreras</div>
          </div>
          <div className="bg-f1-dark-light border border-f1-dark-border rounded-lg p-6 text-center group hover:border-f1-red transition-colors">
            <Trophy className="w-12 h-12 text-f1-gold mx-auto mb-3 group-hover:animate-pulse" />
            <div className="font-f1 text-3xl font-bold text-f1-white mb-1">
              1
            </div>
            <div className="text-f1-white-muted">Campeón</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/leaderboard"
            className="inline-flex items-center justify-center px-8 py-4 f1-gradient rounded-lg font-f1 font-bold text-f1-white hover:scale-105 transition-transform shadow-lg hover:shadow-f1-red/25"
          >
            <Trophy className="w-5 h-5 mr-2" />
            VER CLASIFICACIÓN
          </Link>
          <Link
            to="/calendar"
            className="inline-flex items-center justify-center px-8 py-4 bg-f1-dark-light border-2 border-f1-red rounded-lg font-f1 font-bold text-f1-white hover:bg-f1-red hover:scale-105 transition-all"
          >
            <Calendar className="w-5 h-5 mr-2" />
            CALENDARIO COMPLETO
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
