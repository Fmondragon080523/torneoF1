import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdmin } from "../contexts/AdminContext";
import { useData, Driver, Race, SiteContent } from "../contexts/DataContext";
import {
  Users,
  Calendar,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Upload,
  Image,
  Trophy,
  Clock,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  FileText,
  Zap,
  Crown,
  AlertTriangle,
  Check,
  Target,
  User,
} from "lucide-react";

export default function AdminDashboard() {
  const { isLoggedIn, logout } = useAdmin();
  const navigate = useNavigate();
  const {
    drivers,
    races,
    siteContent,
    addDriver,
    updateDriver,
    deleteDriver,
    addRace,
    updateRace,
    deleteRace,
    updateSiteContent,
    recalculatePositions,
  } = useData();

  const [activeTab, setActiveTab] = useState<"drivers" | "races" | "content">(
    "drivers",
  );
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [sortField, setSortField] = useState<keyof Driver>("position");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [editForm, setEditForm] = useState<any>({});
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/admin");
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Enhanced sorting functionality
  const sortDrivers = (field: keyof Driver) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
  };

  // Get sorted drivers for display
  const getSortedDrivers = () => {
    return [...drivers].sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });
  };

  // Validate time format (MM:SS.SSS)
  const validateTimeFormat = (time: string): boolean => {
    const timeRegex = /^\d{1,2}:\d{2}\.\d{3}$/;
    return timeRegex.test(time);
  };

  const startEdit = (item: Driver | Race, type: "driver" | "race") => {
    setIsEditing(item.id);
    setEditForm({ ...item, type });
    setIsAdding(false);
  };

  const startAdd = (type: "driver" | "race") => {
    setIsAdding(true);
    setIsEditing(null);
    if (type === "driver") {
      setEditForm({
        type: "driver",
        name: "",
        age: "",
        time: "",
        points: "",
        position: drivers.length + 1,
        isNewRecord: false,
        phone: "",
        profileImage: "",
      });
    } else {
      setEditForm({
        type: "race",
        date: "",
        time: "",
        name: "",
        circuit: "",
        country: "",
        status: "upcoming",
        image: "/placeholder.svg",
      });
    }
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setIsAdding(false);
    setEditForm({});
  };

  const saveItem = () => {
    if (editForm.type === "driver") {
      // Enhanced validation with specific field checks
      if (!editForm.name?.trim()) {
        alert("❌ Error: El nombre del competidor es obligatorio");
        return;
      }

      if (
        !editForm.age ||
        parseInt(editForm.age) < 18 ||
        parseInt(editForm.age) > 65
      ) {
        alert("❌ Error: La edad debe estar entre 18 y 65 años");
        return;
      }

      if (!editForm.time?.trim()) {
        alert("❌ Error: El tiempo de vuelta es obligatorio");
        return;
      }

      if (!editForm.points || parseInt(editForm.points) < 0) {
        alert("❌ Error: Los puntos deben ser un número positivo");
        return;
      }

      // Validate time format
      if (!validateTimeFormat(editForm.time)) {
        alert(
          "❌ Error: Formato de tiempo inválido. Use formato MM:SS.SSS (ej: 1:24.582)",
        );
        return;
      }

      // Validate phone format if provided
      if (
        editForm.phone &&
        editForm.phone.trim() &&
        !editForm.phone.match(/^\+?[\d\s\-\(\)]+$/)
      ) {
        alert(
          "❌ Error: Formato de teléfono inválido. Use formato +52 123 456 7890",
        );
        return;
      }

      const driverData = {
        name: editForm.name,
        age: parseInt(editForm.age),
        time: editForm.time,
        points: parseInt(editForm.points),
        position: parseInt(editForm.position),
        isNewRecord: editForm.isNewRecord || false,
        phone: editForm.phone || "",
        profileImage: editForm.profileImage || "",
      };

      if (isAdding) {
        addDriver(driverData);
        alert("✅ ¡Competidor agregado exitosamente!");
      } else {
        updateDriver(editForm.id, driverData);
        alert("✅ ¡Competidor actualizado exitosamente!");
      }
    } else {
      // Validate race fields
      if (
        !editForm.name ||
        !editForm.circuit ||
        !editForm.date ||
        !editForm.time
      ) {
        alert("Por favor completa todos los campos requeridos");
        return;
      }

      const raceData = {
        name: editForm.name,
        circuit: editForm.circuit,
        date: editForm.date,
        time: editForm.time,
        country: editForm.country,
        status: editForm.status,
        image: editForm.image,
        ...(editForm.status === "completed" && {
          winner: editForm.winner,
          fastestLap: editForm.fastestLap,
        }),
      };

      if (isAdding) {
        addRace(raceData);
      } else {
        updateRace(editForm.id, raceData);
      }
    }

    cancelEdit();
  };

  const handleDelete = (id: number, type: "driver" | "race") => {
    if (deleteConfirm === id) {
      if (type === "driver") {
        const driver = drivers.find((d) => d.id === id);
        deleteDriver(id);
        alert(`🗑️ Competidor "${driver?.name}" eliminado exitosamente`);
      } else {
        const race = races.find((r) => r.id === id);
        deleteRace(id);
        alert(`🗑️ Carrera "${race?.name}" eliminada exitosamente`);
      }
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      // Auto-cancel delete confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert to base64 for localStorage persistence
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setEditForm({ ...editForm, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert to base64 for localStorage persistence
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setEditForm({ ...editForm, profileImage: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSiteContentUpdate = (
    field: keyof SiteContent,
    value: string | boolean,
  ) => {
    updateSiteContent({ [field]: value });
  };

  if (!isLoggedIn) {
    return null;
  }

  const getSortIcon = (field: keyof Driver) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  const sortedDrivers = getSortedDrivers();

  return (
    <div className="min-h-screen bg-f1-dark f1-grid-bg">
      {/* Navigation */}
      <nav className="border-b border-f1-dark-border bg-f1-dark-light/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fba99a7590f9b48398a4ec4b9a1921475%2F8c877dcc4c864888b9723b4cfe80a70f?format=webp&width=800"
                alt="Tournament Logo"
                className="w-8 h-8"
              />
              <span className="font-f1 text-xl font-bold text-f1-white">
                F1 PS5 Admin
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-f1-white-muted hover:text-f1-red transition-colors font-medium"
              >
                Ver Sitio
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-f1-white-muted hover:text-f1-red transition-colors font-medium"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-f1 text-4xl font-bold text-f1-white mb-2">
            PANEL DE ADMINISTRACIÓN
          </h1>
          <p className="text-f1-white-muted">
            Gestiona competidores, carreras y todo el contenido del sitio
          </p>
          <div className="mt-4 bg-green-500/20 border border-green-500/50 rounded-lg p-3">
            <p className="text-green-400 text-sm flex items-center">
              <Check className="w-4 h-4 mr-2" />✅ Datos guardados
              automáticamente - No se perderán al refrescar la página
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab("drivers")}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "drivers"
                ? "bg-f1-red text-f1-white"
                : "bg-f1-dark-light text-f1-white-muted hover:text-f1-white"
            }`}
          >
            <Users className="w-5 h-5 mr-2" />
            Competidores ({drivers.length})
          </button>
          <button
            onClick={() => setActiveTab("races")}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "races"
                ? "bg-f1-red text-f1-white"
                : "bg-f1-dark-light text-f1-white-muted hover:text-f1-white"
            }`}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Carreras ({races.length})
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "content"
                ? "bg-f1-red text-f1-white"
                : "bg-f1-dark-light text-f1-white-muted hover:text-f1-white"
            }`}
          >
            <FileText className="w-5 h-5 mr-2" />
            Contenido del Sitio
          </button>
        </div>

        {/* Drivers Tab */}
        {activeTab === "drivers" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h2 className="font-f1 text-2xl font-bold text-f1-white">
                  Gestión de Competidores
                </h2>
                <span className="bg-f1-red/20 text-f1-red px-3 py-1 rounded-full text-sm font-medium">
                  {drivers.length} competidores
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={recalculatePositions}
                  className="flex items-center px-4 py-2 bg-f1-dark-light border border-f1-dark-border rounded-lg font-medium text-f1-white hover:border-f1-red transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Recalcular Posiciones
                </button>
                <button
                  onClick={() => startAdd("driver")}
                  className="flex items-center px-4 py-2 f1-gradient rounded-lg font-medium text-f1-white hover:scale-105 transition-transform"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Competidor
                </button>
              </div>
            </div>

            <div className="bg-f1-dark-light rounded-lg overflow-hidden border border-f1-dark-border">
              <table className="w-full">
                <thead className="bg-f1-red">
                  <tr>
                    <th
                      className="px-6 py-4 text-left font-f1 font-bold text-f1-white text-sm cursor-pointer hover:bg-f1-red-dark transition-colors"
                      onClick={() => sortDrivers("position")}
                    >
                      <div className="flex items-center">
                        POSICIÓN {getSortIcon("position")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left font-f1 font-bold text-f1-white text-sm cursor-pointer hover:bg-f1-red-dark transition-colors"
                      onClick={() => sortDrivers("name")}
                    >
                      <div className="flex items-center">
                        NOMBRE {getSortIcon("name")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left font-f1 font-bold text-f1-white text-sm cursor-pointer hover:bg-f1-red-dark transition-colors"
                      onClick={() => sortDrivers("age")}
                    >
                      <div className="flex items-center">
                        EDAD {getSortIcon("age")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left font-f1 font-bold text-f1-white text-sm cursor-pointer hover:bg-f1-red-dark transition-colors"
                      onClick={() => sortDrivers("time")}
                    >
                      <div className="flex items-center">
                        MEJOR TIEMPO {getSortIcon("time")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left font-f1 font-bold text-f1-white text-sm cursor-pointer hover:bg-f1-red-dark transition-colors"
                      onClick={() => sortDrivers("points")}
                    >
                      <div className="flex items-center">
                        PUNTOS {getSortIcon("points")}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left font-f1 font-bold text-f1-white text-sm">
                      TELÉFONO
                    </th>
                    <th className="px-6 py-4 text-left font-f1 font-bold text-f1-white text-sm">
                      FOTO
                    </th>
                    <th className="px-6 py-4 text-left font-f1 font-bold text-f1-white text-sm">
                      RÉCORD
                    </th>
                    <th className="px-6 py-4 text-left font-f1 font-bold text-f1-white text-sm">
                      ACCIONES
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-f1-dark-border">
                  {sortedDrivers.map((driver) => (
                    <tr
                      key={driver.id}
                      className={`hover:bg-f1-red/10 ${driver.position <= 3 ? "bg-f1-gold/5" : ""}`}
                    >
                      {isEditing === driver.id ? (
                        <>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={editForm.position}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  position: e.target.value,
                                })
                              }
                              className="w-16 px-2 py-1 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                              min="1"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                              placeholder="Nombre completo"
                              required
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={editForm.age}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  age: e.target.value,
                                })
                              }
                              className="w-16 px-2 py-1 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                              min="18"
                              max="65"
                              required
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={editForm.time}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  time: e.target.value,
                                })
                              }
                              placeholder="1:24.582"
                              className="w-28 px-2 py-1 bg-f1-dark border border-f1-dark-border rounded text-f1-white font-mono"
                              pattern="[0-9]+:[0-9]{2}\.[0-9]{3}"
                              title="Formato: M:SS.SSS (ej: 1:24.582)"
                              required
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={editForm.points}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  points: e.target.value,
                                })
                              }
                              className="w-20 px-2 py-1 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                              min="0"
                              required
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="tel"
                              value={editForm.phone || ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  phone: e.target.value,
                                })
                              }
                              placeholder="+52 123 456 7890"
                              className="w-32 px-2 py-1 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                              title="Número de teléfono (privado)"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfileImageUpload}
                                className="hidden"
                                id={`profile-upload-${driver.id}`}
                              />
                              <label
                                htmlFor={`profile-upload-${driver.id}`}
                                className="flex items-center px-2 py-1 bg-f1-dark border border-f1-dark-border rounded cursor-pointer text-f1-white hover:border-f1-red transition-colors text-xs"
                              >
                                <Upload className="w-3 h-3 mr-1" />
                                Foto
                              </label>
                              {editForm.profileImage && (
                                <img
                                  src={editForm.profileImage}
                                  alt="Preview"
                                  className="w-8 h-8 object-cover rounded-full"
                                />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={editForm.isNewRecord || false}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    isNewRecord: e.target.checked,
                                  })
                                }
                                className="mr-2"
                              />
                              <span className="text-f1-white-muted text-sm">
                                Es récord
                              </span>
                            </label>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={saveItem}
                                className="p-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded transition-colors"
                                title="Guardar cambios"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-400/10 rounded transition-colors"
                                title="Cancelar"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {driver.position <= 3 && (
                                <Crown className="w-4 h-4 text-f1-gold mr-2" />
                              )}
                              <span className="font-f1 font-bold text-f1-white">
                                {driver.position}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-f1-white font-medium">
                            {driver.name}
                          </td>
                          <td className="px-6 py-4 text-f1-white-muted">
                            {driver.age}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-f1 font-bold text-f1-red font-mono">
                              {driver.time}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-f1 font-bold text-f1-red">
                            {driver.points}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-f1-white-muted font-mono text-sm">
                              {driver.phone || "Sin teléfono"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {driver.profileImage ? (
                              <img
                                src={driver.profileImage}
                                alt={driver.name}
                                className="w-8 h-8 object-cover rounded-full"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-f1-dark-border rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-f1-white-muted" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {driver.isNewRecord && (
                              <div className="flex items-center text-f1-gold">
                                <Zap className="w-4 h-4 mr-1" />
                                <span className="text-xs font-medium">
                                  RÉCORD
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => startEdit(driver, "driver")}
                                className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded transition-colors"
                                title="Editar competidor"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(driver.id, "driver")
                                }
                                className={`p-2 rounded transition-colors ${
                                  deleteConfirm === driver.id
                                    ? "text-red-300 bg-red-400/20"
                                    : "text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                }`}
                                title={
                                  deleteConfirm === driver.id
                                    ? "Confirmar eliminación"
                                    : "Eliminar competidor"
                                }
                              >
                                {deleteConfirm === driver.id ? (
                                  <AlertTriangle className="w-4 h-4" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}

                  {/* Add new row */}
                  {isAdding && editForm.type === "driver" && (
                    <tr className="bg-f1-red/10 border-t-2 border-f1-red">
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={editForm.position}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              position: e.target.value,
                            })
                          }
                          className="w-16 px-2 py-1 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                          min="1"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          placeholder="Nombre del competidor"
                          className="w-full px-2 py-1 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                          required
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={editForm.age}
                          onChange={(e) =>
                            setEditForm({ ...editForm, age: e.target.value })
                          }
                          placeholder="25"
                          className="w-16 px-2 py-1 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                          min="18"
                          max="65"
                          required
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.time}
                          onChange={(e) =>
                            setEditForm({ ...editForm, time: e.target.value })
                          }
                          placeholder="1:24.582"
                          className="w-28 px-2 py-1 bg-f1-dark border border-f1-dark-border rounded text-f1-white font-mono"
                          pattern="[0-9]+:[0-9]{2}\.[0-9]{3}"
                          title="Formato: M:SS.SSS"
                          required
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={editForm.points}
                          onChange={(e) =>
                            setEditForm({ ...editForm, points: e.target.value })
                          }
                          placeholder="0"
                          className="w-20 px-2 py-1 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                          min="0"
                          required
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="tel"
                          value={editForm.phone || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, phone: e.target.value })
                          }
                          placeholder="+52 123 456 7890"
                          className="w-32 px-2 py-1 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                          title="Número de teléfono (privado)"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                            className="hidden"
                            id="profile-upload-new"
                          />
                          <label
                            htmlFor="profile-upload-new"
                            className="flex items-center px-2 py-1 bg-f1-dark border border-f1-dark-border rounded cursor-pointer text-f1-white hover:border-f1-red transition-colors text-xs"
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            Foto
                          </label>
                          {editForm.profileImage && (
                            <img
                              src={editForm.profileImage}
                              alt="Preview"
                              className="w-8 h-8 object-cover rounded-full"
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editForm.isNewRecord || false}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                isNewRecord: e.target.checked,
                              })
                            }
                            className="mr-2"
                          />
                          <span className="text-f1-white-muted text-sm">
                            Es récord
                          </span>
                        </label>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={saveItem}
                            className="p-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded transition-colors"
                            title="Guardar competidor"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-400/10 rounded transition-colors"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Races Tab */}
        {activeTab === "races" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h2 className="font-f1 text-2xl font-bold text-f1-white">
                  Gestión de Carreras
                </h2>
                <span className="bg-f1-red/20 text-f1-red px-3 py-1 rounded-full text-sm font-medium">
                  {races.length} carreras
                </span>
              </div>
              <button
                onClick={() => startAdd("race")}
                className="flex items-center px-4 py-2 f1-gradient rounded-lg font-medium text-f1-white hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Carrera
              </button>
            </div>

            <div className="grid gap-6">
              {races.map((race) => (
                <div
                  key={race.id}
                  className="bg-f1-dark-light border border-f1-dark-border rounded-lg p-6 hover:border-f1-red transition-colors"
                >
                  {isEditing === race.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-f1-white text-sm font-medium mb-2">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-f1-white text-sm font-medium mb-2">
                          Circuito *
                        </label>
                        <input
                          type="text"
                          value={editForm.circuit}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              circuit: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-f1-white text-sm font-medium mb-2">
                          Fecha *
                        </label>
                        <input
                          type="text"
                          value={editForm.date}
                          onChange={(e) =>
                            setEditForm({ ...editForm, date: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                          placeholder="4 de septiembre"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-f1-white text-sm font-medium mb-2">
                          Hora *
                        </label>
                        <input
                          type="text"
                          value={editForm.time}
                          onChange={(e) =>
                            setEditForm({ ...editForm, time: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                          placeholder="14:00"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-f1-white text-sm font-medium mb-2">
                          País
                        </label>
                        <input
                          type="text"
                          value={editForm.country}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              country: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                        />
                      </div>
                      <div>
                        <label className="block text-f1-white text-sm font-medium mb-2">
                          Estado
                        </label>
                        <select
                          value={editForm.status}
                          onChange={(e) =>
                            setEditForm({ ...editForm, status: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                        >
                          <option value="upcoming">Pendiente</option>
                          <option value="next">Próxima</option>
                          <option value="completed">Completada</option>
                        </select>
                      </div>
                      {editForm.status === "completed" && (
                        <>
                          <div>
                            <label className="block text-f1-white text-sm font-medium mb-2">
                              Ganador
                            </label>
                            <input
                              type="text"
                              value={editForm.winner || ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  winner: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                              placeholder="Nombre del ganador"
                            />
                          </div>
                          <div>
                            <label className="block text-f1-white text-sm font-medium mb-2">
                              Vuelta Rápida
                            </label>
                            <input
                              type="text"
                              value={editForm.fastestLap || ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  fastestLap: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white font-mono"
                              placeholder="1:24.582"
                            />
                          </div>
                        </>
                      )}
                      <div className="md:col-span-2">
                        <label className="block text-f1-white text-sm font-medium mb-2">
                          Imagen del Circuito
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id={`image-upload-${race.id}`}
                          />
                          <label
                            htmlFor={`image-upload-${race.id}`}
                            className="flex items-center px-4 py-2 bg-f1-dark border border-f1-dark-border rounded cursor-pointer text-f1-white hover:border-f1-red transition-colors"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Subir Imagen
                          </label>
                          {editForm.image && (
                            <img
                              src={editForm.image}
                              alt="Preview"
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-2 flex justify-end space-x-4">
                        <button
                          onClick={saveItem}
                          className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white transition-colors"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Guardar
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white transition-colors"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={race.image}
                          alt={race.circuit}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-f1 text-xl font-bold text-f1-white">
                            {race.name}
                          </h3>
                          <p className="text-f1-white-muted">
                            {race.circuit}, {race.country}
                          </p>
                          <p className="text-f1-white-muted">
                            {race.date} • {race.time}
                          </p>
                          <div className="flex items-center mt-2">
                            {race.status === "completed" ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            ) : race.status === "next" ? (
                              <Clock className="w-4 h-4 text-f1-red mr-2" />
                            ) : (
                              <Calendar className="w-4 h-4 text-f1-white-muted mr-2" />
                            )}
                            <span className="text-sm text-f1-white-muted capitalize">
                              {race.status === "completed"
                                ? "Completada"
                                : race.status === "next"
                                  ? "Próxima"
                                  : "Pendiente"}
                            </span>
                          </div>
                          {race.status === "completed" && race.winner && (
                            <div className="mt-2">
                              <p className="text-f1-gold text-sm font-medium">
                                🏆 Ganador: {race.winner}
                              </p>
                              {race.fastestLap && (
                                <p className="text-f1-red text-sm font-mono">
                                  ⚡ Vuelta rápida: {race.fastestLap}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(race, "race")}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded transition-colors"
                          title="Editar carrera"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(race.id, "race")}
                          className={`p-2 rounded transition-colors ${
                            deleteConfirm === race.id
                              ? "text-red-300 bg-red-400/20"
                              : "text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          }`}
                          title={
                            deleteConfirm === race.id
                              ? "Confirmar eliminación"
                              : "Eliminar carrera"
                          }
                        >
                          {deleteConfirm === race.id ? (
                            <AlertTriangle className="w-5 h-5" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add new race */}
              {isAdding && editForm.type === "race" && (
                <div className="bg-f1-red/10 border-2 border-f1-red rounded-lg p-6">
                  <h3 className="font-f1 text-xl font-bold text-f1-white mb-4 flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Agregar Nueva Carrera
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-f1-white text-sm font-medium mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        placeholder="Carrera 5"
                        className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-f1-white text-sm font-medium mb-2">
                        Circuito *
                      </label>
                      <input
                        type="text"
                        value={editForm.circuit}
                        onChange={(e) =>
                          setEditForm({ ...editForm, circuit: e.target.value })
                        }
                        placeholder="Suzuka"
                        className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-f1-white text-sm font-medium mb-2">
                        Fecha *
                      </label>
                      <input
                        type="text"
                        value={editForm.date}
                        onChange={(e) =>
                          setEditForm({ ...editForm, date: e.target.value })
                        }
                        placeholder="8 de septiembre"
                        className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-f1-white text-sm font-medium mb-2">
                        Hora *
                      </label>
                      <input
                        type="text"
                        value={editForm.time}
                        onChange={(e) =>
                          setEditForm({ ...editForm, time: e.target.value })
                        }
                        placeholder="14:00"
                        className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-f1-white text-sm font-medium mb-2">
                        País
                      </label>
                      <input
                        type="text"
                        value={editForm.country}
                        onChange={(e) =>
                          setEditForm({ ...editForm, country: e.target.value })
                        }
                        placeholder="Japón"
                        className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                      />
                    </div>
                    <div>
                      <label className="block text-f1-white text-sm font-medium mb-2">
                        Estado
                      </label>
                      <select
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm({ ...editForm, status: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                      >
                        <option value="upcoming">Pendiente</option>
                        <option value="next">Próxima</option>
                        <option value="completed">Completada</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-f1-white text-sm font-medium mb-2">
                        Imagen del Circuito
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload-new"
                        />
                        <label
                          htmlFor="image-upload-new"
                          className="flex items-center px-4 py-2 bg-f1-dark border border-f1-dark-border rounded cursor-pointer text-f1-white hover:border-f1-red transition-colors"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Subir Imagen
                        </label>
                        {editForm.image &&
                          editForm.image !== "/placeholder.svg" && (
                            <img
                              src={editForm.image}
                              alt="Preview"
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                      </div>
                    </div>
                    <div className="md:col-span-2 flex justify-end space-x-4">
                      <button
                        onClick={saveItem}
                        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white transition-colors"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Crear Carrera
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white transition-colors"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Site Content Tab */}
        {activeTab === "content" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-f1 text-2xl font-bold text-f1-white">
                Contenido del Sitio
              </h2>
              <div className="flex items-center text-f1-white-muted">
                <Target className="w-5 h-5 mr-2" />
                Modifica textos y configuraciones
              </div>
            </div>

            <div className="grid gap-6">
              {/* Hero Section */}
              <div className="bg-f1-dark-light border border-f1-dark-border rounded-lg p-6">
                <h3 className="font-f1 text-xl font-bold text-f1-white mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-f1-gold" />
                  Sección Principal (Hero)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-f1-white text-sm font-medium mb-2">
                      Título Principal
                    </label>
                    <input
                      type="text"
                      value={siteContent.heroTitle}
                      onChange={(e) =>
                        handleSiteContentUpdate("heroTitle", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white font-f1 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-f1-white text-sm font-medium mb-2">
                      Subtítulo
                    </label>
                    <input
                      type="text"
                      value={siteContent.heroSubtitle}
                      onChange={(e) =>
                        handleSiteContentUpdate("heroSubtitle", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white font-f1 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-f1-white text-sm font-medium mb-2">
                      Fechas del Torneo
                    </label>
                    <input
                      type="text"
                      value={siteContent.tournamentDates}
                      onChange={(e) =>
                        handleSiteContentUpdate(
                          "tournamentDates",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                    />
                  </div>
                  <div>
                    <label className="block text-f1-white text-sm font-medium mb-2">
                      Descripción
                    </label>
                    <input
                      type="text"
                      value={siteContent.tournamentDescription}
                      onChange={(e) =>
                        handleSiteContentUpdate(
                          "tournamentDescription",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                    />
                  </div>
                </div>
              </div>

              {/* Last Race Winner */}
              <div className="bg-f1-dark-light border border-f1-dark-border rounded-lg p-6">
                <h3 className="font-f1 text-xl font-bold text-f1-white mb-4 flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-f1-gold" />
                  Última Carrera
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-f1-white text-sm font-medium mb-2">
                      Ganador
                    </label>
                    <input
                      type="text"
                      value={siteContent.lastRaceWinner}
                      onChange={(e) =>
                        handleSiteContentUpdate(
                          "lastRaceWinner",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                    />
                  </div>
                  <div>
                    <label className="block text-f1-white text-sm font-medium mb-2">
                      Tiempo
                    </label>
                    <input
                      type="text"
                      value={siteContent.lastRaceTime}
                      onChange={(e) =>
                        handleSiteContentUpdate("lastRaceTime", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white font-mono"
                      placeholder="1:24.582"
                    />
                  </div>
                  <div>
                    <label className="block text-f1-white text-sm font-medium mb-2">
                      Circuito
                    </label>
                    <input
                      type="text"
                      value={siteContent.lastRaceCircuit}
                      onChange={(e) =>
                        handleSiteContentUpdate(
                          "lastRaceCircuit",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                    />
                  </div>
                  <div>
                    <label className="block text-f1-white text-sm font-medium mb-2">
                      Mostrar Animación
                    </label>
                    <label className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        checked={siteContent.showWinnerAnimation}
                        onChange={(e) =>
                          handleSiteContentUpdate(
                            "showWinnerAnimation",
                            e.target.checked,
                          )
                        }
                        className="mr-2"
                      />
                      <span className="text-f1-white-muted">
                        Activar efectos especiales
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Next Race */}
              <div className="bg-f1-dark-light border border-f1-dark-border rounded-lg p-6">
                <h3 className="font-f1 text-xl font-bold text-f1-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-f1-red" />
                  Próxima Carrera
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-f1-white text-sm font-medium mb-2">
                      Fecha y Hora (ISO)
                    </label>
                    <input
                      type="datetime-local"
                      value={siteContent.nextRaceDate.slice(0, 16)}
                      onChange={(e) =>
                        handleSiteContentUpdate(
                          "nextRaceDate",
                          e.target.value + ":00",
                        )
                      }
                      className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                    />
                  </div>
                  <div>
                    <label className="block text-f1-white text-sm font-medium mb-2">
                      Nombre de la Carrera
                    </label>
                    <input
                      type="text"
                      value={siteContent.nextRaceName}
                      onChange={(e) =>
                        handleSiteContentUpdate("nextRaceName", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                    />
                  </div>
                  <div>
                    <label className="block text-f1-white text-sm font-medium mb-2">
                      Circuito
                    </label>
                    <input
                      type="text"
                      value={siteContent.nextRaceCircuit}
                      onChange={(e) =>
                        handleSiteContentUpdate(
                          "nextRaceCircuit",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 bg-f1-dark border border-f1-dark-border rounded text-f1-white"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-f1-dark-light border border-green-500 rounded-lg p-6">
                <h3 className="font-f1 text-xl font-bold text-f1-white mb-4 flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-500" />
                  Vista Previa
                </h3>
                <div className="bg-f1-dark rounded-lg p-4 border border-f1-dark-border">
                  <div className="text-center">
                    <h1 className="font-f1 text-4xl font-black text-f1-white mb-2 f1-text-shadow">
                      {siteContent.heroTitle}
                    </h1>
                    <div className="inline-block f1-gradient px-6 py-2 rounded-lg mb-2">
                      <p className="font-f1 text-xl font-bold text-f1-white">
                        {siteContent.heroSubtitle}
                      </p>
                    </div>
                    <p className="text-f1-white-muted">
                      {siteContent.tournamentDates} •{" "}
                      {siteContent.tournamentDescription}
                    </p>
                  </div>
                </div>
                <p className="text-f1-white-muted text-sm mt-4">
                  💡 Los cambios se aplicarán inmediatamente en el sitio web
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
