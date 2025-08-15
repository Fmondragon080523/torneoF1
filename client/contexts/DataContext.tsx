import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Driver {
  id: number;
  name: string;
  age: number;
  time: string;
  points: number;
  position: number;
  isNewRecord?: boolean;
  phone?: string; // Private field - only visible in admin
  profileImage?: string; // Profile image URL or base64
}

export interface Race {
  id: number;
  date: string;
  time: string;
  name: string;
  circuit: string;
  country: string;
  status: "completed" | "upcoming" | "next";
  winner?: string;
  fastestLap?: string;
  image: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  tournamentDates: string;
  tournamentDescription: string;
  lastRaceWinner: string;
  lastRaceTime: string;
  lastRaceCircuit: string;
  showWinnerAnimation: boolean;
  nextRaceDate: string;
  nextRaceName: string;
  nextRaceCircuit: string;
}

interface DataContextType {
  drivers: Driver[];
  races: Race[];
  siteContent: SiteContent;
  updateDrivers: (drivers: Driver[]) => void;
  updateRaces: (races: Race[]) => void;
  updateSiteContent: (content: Partial<SiteContent>) => void;
  addDriver: (driver: Omit<Driver, "id">) => void;
  updateDriver: (id: number, driver: Partial<Driver>) => void;
  deleteDriver: (id: number) => void;
  addRace: (race: Omit<Race, "id">) => void;
  updateRace: (id: number, race: Partial<Race>) => void;
  deleteRace: (id: number) => void;
  recalculatePositions: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

// Default data
const defaultDrivers: Driver[] = [
  {
    id: 1,
    name: "Carlos Sainz",
    age: 29,
    time: "1:24.582",
    points: 95,
    position: 1,
    isNewRecord: true,
    phone: "+34 600 123 456",
  },
  {
    id: 2,
    name: "Max Verstappen",
    age: 26,
    time: "1:24.891",
    points: 88,
    position: 2,
    phone: "+31 612 345 678",
  },
  {
    id: 3,
    name: "Lewis Hamilton",
    age: 39,
    time: "1:25.234",
    points: 82,
    position: 3,
    phone: "+44 7700 900 123",
  },
  {
    id: 4,
    name: "Charles Leclerc",
    age: 26,
    time: "1:25.567",
    points: 75,
    position: 4,
    phone: "+377 06 12 34 56",
  },
  {
    id: 5,
    name: "Lando Norris",
    age: 24,
    time: "1:25.789",
    points: 68,
    position: 5,
    phone: "+44 7911 123 456",
  },
  {
    id: 6,
    name: "George Russell",
    age: 26,
    time: "1:26.123",
    points: 61,
    position: 6,
    phone: "+44 7700 900 789",
  },
];

const defaultRaces: Race[] = [
  {
    id: 1,
    date: "4 de septiembre",
    time: "14:00",
    name: "Carrera 1",
    circuit: "Silverstone",
    country: "Reino Unido",
    status: "completed",
    winner: "Carlos Sainz",
    fastestLap: "1:24.582",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    date: "5 de septiembre",
    time: "14:00",
    name: "Carrera 2",
    circuit: "Monaco",
    country: "Mónaco",
    status: "next",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    date: "6 de septiembre",
    time: "14:00",
    name: "Carrera 3",
    circuit: "Spa-Francorchamps",
    country: "Bélgica",
    status: "upcoming",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    date: "7 de septiembre",
    time: "18:00",
    name: "Carrera Final",
    circuit: "Monza",
    country: "Italia",
    status: "upcoming",
    image: "/placeholder.svg",
  },
];

const defaultSiteContent: SiteContent = {
  heroTitle: "TORNEO F1",
  heroSubtitle: "PS5 CHAMPIONSHIP",
  tournamentDates: "4 al 7 de septiembre",
  tournamentDescription: "4 carreras épicas",
  lastRaceWinner: "Carlos Sainz",
  lastRaceTime: "1:24.582",
  lastRaceCircuit: "Monaco",
  showWinnerAnimation: true,
  nextRaceDate: "2024-09-04T14:00:00",
  nextRaceName: "Carrera 1",
  nextRaceCircuit: "Silverstone",
};

export const DataProvider = ({ children }: DataProviderProps) => {
  const [drivers, setDrivers] = useState<Driver[]>(defaultDrivers);
  const [races, setRaces] = useState<Race[]>(defaultRaces);
  const [siteContent, setSiteContent] =
    useState<SiteContent>(defaultSiteContent);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedDrivers = localStorage.getItem("f1-tournament-drivers");
      const savedRaces = localStorage.getItem("f1-tournament-races");
      const savedContent = localStorage.getItem("f1-tournament-content");

      if (savedDrivers) {
        setDrivers(JSON.parse(savedDrivers));
      }
      if (savedRaces) {
        setRaces(JSON.parse(savedRaces));
      }
      if (savedContent) {
        setSiteContent(JSON.parse(savedContent));
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem("f1-tournament-drivers", JSON.stringify(drivers));
    } catch (error) {
      console.error("Error saving drivers to localStorage:", error);
    }
  }, [drivers]);

  useEffect(() => {
    try {
      localStorage.setItem("f1-tournament-races", JSON.stringify(races));
    } catch (error) {
      console.error("Error saving races to localStorage:", error);
    }
  }, [races]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "f1-tournament-content",
        JSON.stringify(siteContent),
      );
    } catch (error) {
      console.error("Error saving content to localStorage:", error);
    }
  }, [siteContent]);

  const updateDrivers = (newDrivers: Driver[]) => {
    setDrivers(newDrivers);
  };

  const updateRaces = (newRaces: Race[]) => {
    setRaces(newRaces);
  };

  const updateSiteContent = (newContent: Partial<SiteContent>) => {
    setSiteContent((prev) => ({ ...prev, ...newContent }));
  };

  const addDriver = (driverData: Omit<Driver, "id">) => {
    const newDriver = {
      ...driverData,
      id: Date.now() + Math.random(), // Ensure unique ID
    };
    setDrivers((prev) => [...prev, newDriver]);
  };

  const updateDriver = (id: number, driverData: Partial<Driver>) => {
    setDrivers((prev) =>
      prev.map((driver) =>
        driver.id === id ? { ...driver, ...driverData } : driver,
      ),
    );
  };

  const deleteDriver = (id: number) => {
    setDrivers((prev) => prev.filter((driver) => driver.id !== id));
  };

  const addRace = (raceData: Omit<Race, "id">) => {
    const newRace = {
      ...raceData,
      id: Date.now() + Math.random(), // Ensure unique ID
    };
    setRaces((prev) => [...prev, newRace]);
  };

  const updateRace = (id: number, raceData: Partial<Race>) => {
    setRaces((prev) =>
      prev.map((race) => (race.id === id ? { ...race, ...raceData } : race)),
    );
  };

  const deleteRace = (id: number) => {
    setRaces((prev) => prev.filter((race) => race.id !== id));
  };

  const recalculatePositions = () => {
    const sorted = [...drivers].sort((a, b) => b.points - a.points);
    const updated = sorted.map((driver, index) => ({
      ...driver,
      position: index + 1,
    }));
    setDrivers(updated);
  };

  // Update site content automatically when drivers/races change
  useEffect(() => {
    // Update last race winner based on most recent completed race
    const completedRaces = races.filter((race) => race.status === "completed");
    if (completedRaces.length > 0) {
      const lastRace = completedRaces[completedRaces.length - 1];
      if (lastRace.winner && lastRace.fastestLap) {
        updateSiteContent({
          lastRaceWinner: lastRace.winner,
          lastRaceTime: lastRace.fastestLap,
          lastRaceCircuit: lastRace.circuit,
        });
      }
    }

    // Update next race info
    const nextRace = races.find((race) => race.status === "next");
    if (nextRace) {
      updateSiteContent({
        nextRaceName: nextRace.name,
        nextRaceCircuit: nextRace.circuit,
      });
    }
  }, [drivers, races]);

  return (
    <DataContext.Provider
      value={{
        drivers,
        races,
        siteContent,
        updateDrivers,
        updateRaces,
        updateSiteContent,
        addDriver,
        updateDriver,
        deleteDriver,
        addRace,
        updateRace,
        deleteRace,
        recalculatePositions,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
