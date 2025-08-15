import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-f1-dark f1-grid-bg">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fba99a7590f9b48398a4ec4b9a1921475%2F29f6da581e3748eaa63f74cf1fc8b1d3?format=webp&width=800"
            alt="Tournament Logo"
            className="w-16 h-16 mx-auto mb-4 rounded-full"
          />
          <h1 className="font-f1 text-8xl font-black text-f1-white mb-4 f1-text-shadow">
            404
          </h1>
          <p className="text-xl text-f1-white-muted mb-6 font-racing">
            ¡Parece que te has salido de la pista!
          </p>
          <p className="text-f1-white-muted mb-8">
            La página que buscas no existe en el circuito.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center px-8 py-4 f1-gradient rounded-lg font-f1 font-bold text-f1-white hover:scale-105 transition-transform shadow-lg hover:shadow-f1-red/25"
        >
          <Home className="w-5 h-5 mr-2" />
          VOLVER AL PADDOCK
        </Link>
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
};

export default NotFound;
