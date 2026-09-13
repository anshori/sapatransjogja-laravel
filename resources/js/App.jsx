import { useState, useRef, useEffect } from "react";

// Halaman & Komponen User
import Home from "./pages/Home";
import Preference from "./pages/Preference";
import ChatPage from "./pages/ChatPage";
import MapPage from "./pages/MapPage";
import BottomNavbar from "./components/BottomNavbar";

// Halaman & Komponen Admin
import Dashboard from "./pages/Dashboard";
import PetaAksesibilitas from "./pages/PetaAksesibilitas";
import Sidebar from "./components/Sidebar";

// Tab yang dikategorikan sebagai area Admin
const ADMIN_TABS = ["dashboard", "peta", "statistik", "data-halte", "data-rute"];

export default function App() {
  const isUrlAdmin = window.location.pathname.startsWith("/adminers");
  const [showSplash, setShowSplash] = useState(true);

  const [activeTab, setActiveTab] = useState(isUrlAdmin ? "dashboard" : "home");
  const [mapAction, setMapAction] = useState(null);
  const mapRef = useRef(null);

  //splash screen selama 2.5 s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Membuka peta dari Halaman Home
  const handleOpenMap = (mapData) => {
    setMapAction(mapData);
    setActiveTab("map");
  };

  // Memproses aksi pergerakan peta dari AI Chatbot
  const handleMapAction = (actionData) => {
    setMapAction(actionData);

    if (activeTab !== "map") {
      setActiveTab("map");
    }

    // Eksekusi animasi pergerakan peta jika ada koordinat center
    if (actionData?.center) {
      setTimeout(() => {
        mapRef.current?.flyTo?.({
          center: actionData.center,
          zoom: actionData.zoom || 15.5,
          essential: true,
          speed: 1.2,
        });
      }, 150);
    }
  };

  const isAdminTab = ADMIN_TABS.includes(activeTab);

  return (
    <div className="relative flex min-h-screen bg-white">
      {/* ==================== TAMPILAN ADMIN (/adminers) ==================== */}
      {isAdminTab ? (
        <>
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="flex-1 overflow-y-auto bg-gray-50">
            {activeTab === "dashboard" && <Dashboard setActiveTab={setActiveTab} />}
            {activeTab === "peta" && <PetaAksesibilitas />}
            {activeTab === "statistik" && (
              <div className="p-8 font-bold text-gray-700">Halaman Statistik</div>
            )}
            {activeTab === "data-halte" && (
              <div className="p-8 font-bold text-gray-700">Halaman Data Halte</div>
            )}
            {activeTab === "data-rute" && (
              <div className="p-8 font-bold text-gray-700">Halaman Data Rute</div>
            )}
          </main>
        </>
      ) : (
        /* ==================== TAMPILAN USER BIASA ==================== */
        <div className="flex-1">
          {activeTab === "home" && (
            <Home
              onPreference={() => setActiveTab("preference")}
              onChat={() => setActiveTab("chat")}
              onMap={() => setActiveTab("map")}
              onOpenMap={handleOpenMap}
            />
          )}

      {activeTab === "preference" && (
        <Preference
          onBack={() => setActiveTab("home")}
        />
      )}

          {activeTab === "chat" && (
            <ChatPage
              onBack={() => setActiveTab("home")}
              onMapAction={handleMapAction}
            />
          )}

      {activeTab === "map" && (
        <MapPage
          ref={mapRef}
          onBack={() => setActiveTab("home")}
          onMapAction={handleMapAction}
          mapAction={mapAction}
        />
      )}

          {activeTab !== "preference" && (
            <BottomNavbar
              activeTab={activeTab}
              handleNavigation={setActiveTab}
            />
          )}
        </div>
      )}
    </div>
  );
}