import React from 'react';
import { LayoutDashboard, MapPin, FileText, ChevronRight } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  // Susunan menu dan ikon disesuaikan persis dengan gambar kedua
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'peta', label: 'Peta Aksesibilitas', icon: MapPin },
    { id: 'statistik', label: 'Statistik', icon: FileText },
    { id: 'data-halte', label: 'Data Halte', icon: FileText },
    { id: 'data-rute', label: 'Data Rute', icon: FileText },
  ];

  return (
    <aside 
      // Menggunakan warna biru spesifik yang mirip dengan gambar kedua (#4880FF)
      className="w-[260px] bg-[#4B83F3] h-screen sticky top-0 flex flex-col justify-between shrink-0 overflow-hidden"
    >
      
      {/* Container Atas: Logo & Navigasi */}
      <div className="flex flex-col flex-1 mt-10">
        
        {/* Tipografi "SAPA Trans Jogja" */}
        <h1 
          className="text-[20px] font-bold text-white mb-10 pl-8 shrink-0"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          SAPA Trans Jogja
        </h1>

        {/* Navigation Links */}
        {/* pl-6 agar menu punya jarak di kiri, tapi menempel ke kanan */}
        <nav className="space-y-2 flex-1 pl-6 overflow-y-auto scrollbar-none">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-4 py-3.5 pl-6 transition-colors ${
                  isActive 
                    ? 'bg-white rounded-l-[20px]' // Melengkung di kiri, lurus di kanan
                    : 'text-white hover:bg-white/10 rounded-l-[20px]'
                }`}
                style={
                  isActive
                    ? {
                        color: '#4B83F3', // Warna biru sama dengan background sidebar
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '15px',
                        fontWeight: 600,
                      }
                    : {
                        color: '#FFFFFF',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '15px',
                        fontWeight: 500,
                      }
                }
              >
                {/* Ikon Menu */}
                <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Button Keluar (Terkunci di Paling Bawah) */}
      <div className="mb-6 px-6 shrink-0">
        <div className="border-t border-white/20 pt-4">
          <button 
            className="flex items-center justify-between w-full py-2 text-white hover:text-gray-200 transition-colors text-[15px]"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
          >
            <span>Keluar</span>
            {/* Ikon panah sesuai gambar kedua */}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
}