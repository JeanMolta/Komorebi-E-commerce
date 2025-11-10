// src/components/homepage/ProfilePage.tsx

import React, { useState } from 'react';
import { User, MapPin, Mail, Phone, ShoppingBag, DollarSign, LogOut } from 'lucide-react';

// --- Datos de Perfil de Ejemplo ---
const mockUser = {
  name: "Sofía Martínez",
  email: "sofia.martinez@komorebi.com",
  phone: "+57 310 123 4567",
  location: "Bogotá, Colombia",
  avatarUrl: "https://via.placeholder.com/150x150.png?text=SM",
  memberSince: "Enero 2024",
  lifetimeSpend: 450000,
  totalOrders: 15,
};

// --- Componentes Auxiliares para las Pestañas ---

const ProfileInfo: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* Información principal */}
      <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-[var(--komorebi-yellow)]">
        <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--komorebi-black)' }}>
          Datos de Contacto
        </h3>
        <p className="flex items-center gap-3 text-gray-700 mt-2">
          <Mail size={18} className="text-[var(--komorebi-pink)]" /> 
          {mockUser.email}
        </p>
        <p className="flex items-center gap-3 text-gray-700 mt-2">
          <Phone size={18} className="text-[var(--komorebi-pink)]" /> 
          {mockUser.phone}
        </p>
        <p className="flex items-center gap-3 text-gray-700 mt-2">
          <MapPin size={18} className="text-[var(--komorebi-pink)]" /> 
          {mockUser.location}
        </p>
      </div>

      {/* Métricas rápidas */}
      <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-[var(--komorebi-pink)] space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-600 font-medium">Miembro desde</p>
          <span className="font-semibold text-[var(--komorebi-black)]">{mockUser.memberSince}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 font-medium">Gasto total</p>
          <span className="font-bold text-lg" style={{ color: 'var(--komorebi-pink)' }}>
            ${(mockUser.lifetimeSpend).toLocaleString('es-CO')}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 font-medium">Órdenes completadas</p>
          <span className="font-semibold text-[var(--komorebi-black)]">{mockUser.totalOrders}</span>
        </div>
      </div>
    </div>

    {/* Botón de Edición (Simulado) */}
    <button className="w-full md:w-auto bg-[var(--komorebi-yellow)]/100 text-[var(--komorebi-black)] px-6 py-3 rounded-full hover:brightness-95 transition-colors font-bold shadow-md">
      Editar Perfil
    </button>
  </div>
);

// Componente de simulación para Órdenes
const OrdersHistory: React.FC = () => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--komorebi-black)' }}>
      Historial de Órdenes
    </h3>
    <ul className="space-y-3">
      <li className="flex justify-between p-3 border-b border-gray-100 last:border-b-0">
        <p>#KM1024 - 3 Productos</p>
        <span className="font-semibold text-[var(--komorebi-pink)]">$45.000</span>
        <span className="text-sm text-green-600">Entregado</span>
      </li>
      <li className="flex justify-between p-3 border-b border-gray-100 last:border-b-0">
        <p>#KM1023 - 1 Producto</p>
        <span className="font-semibold text-[var(--komorebi-pink)]">$12.000</span>
        <span className="text-sm text-blue-600">Enviado</span>
      </li>
      <li className="flex justify-between p-3 border-b border-gray-100 last:border-b-0">
        <p>#KM1022 - 5 Productos</p>
        <span className="font-semibold text-[var(--komorebi-pink)]">$98.500</span>
        <span className="text-sm text-green-600">Entregado</span>
      </li>
    </ul>
  </div>
);

// Componente de simulación para Ventas
const SellingDashboard: React.FC = () => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--komorebi-black)' }}>
      Tu Panel de Ventas
    </h3>
    <p className="text-lg text-gray-700">
      Aún no tienes productos listados. ¡Empieza a vender tus snacks favoritos hoy!
    </p>
    <button className="mt-4 bg-[var(--komorebi-black)] text-white px-5 py-2 rounded-full hover:opacity-90 transition-colors flex items-center gap-2">
      <DollarSign size={20} /> Listar Producto
    </button>
  </div>
);

// --- Componente Principal ---

const TABS = [
  { id: 'profile', label: 'Mi Perfil', icon: User, content: <ProfileInfo /> },
  { id: 'orders', label: 'Órdenes', icon: ShoppingBag, content: <OrdersHistory /> },
  { id: 'selling', label: 'Mis Ventas', icon: DollarSign, content: <SellingDashboard /> },
];


const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <div className="container mx-auto px-4 py-12" style={{ minHeight: 'calc(100vh - 200px)' }}>
      
      {/* Header del Perfil */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 p-6 bg-white rounded-xl shadow-lg">
        <div className="flex items-center gap-6">
          <img 
            src={mockUser.avatarUrl} 
            alt="Avatar" 
            className="w-24 h-24 rounded-full border-4 border-[var(--komorebi-yellow)]"
          />
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--komorebi-black)' }}>
              {mockUser.name}
            </h1>
            <p className="text-gray-500">Miembro de Komorebi desde {mockUser.memberSince}</p>
          </div>
        </div>
        <button 
          onClick={() => alert("Cerrando sesión...")}
          className="mt-4 md:mt-0 text-red-500 hover:text-red-700 transition-colors font-medium flex items-center gap-2"
        >
          <LogOut size={20} /> Cerrar Sesión
        </button>
      </div>

      {/* Navegación de Pestañas */}
      <div className="mb-8">
        <nav className="flex space-x-2 md:space-x-4 border-b border-gray-200 overflow-x-auto whitespace-nowrap">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  inline-flex items-center gap-2 px-4 py-3 text-lg font-medium transition-colors
                  ${isActive
                    ? 'border-b-4 border-[var(--komorebi-pink)] text-[var(--komorebi-pink)]'
                    : 'text-gray-500 hover:text-[var(--komorebi-black)]'
                  }
                `}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenido de la Pestaña Activa */}
      <div>
        {TABS.find(tab => tab.id === activeTab)?.content}
      </div>

    </div>
  );
};

export default ProfilePage;