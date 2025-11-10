// src/components/homepage/ProfilePage.tsx

import React, { useState } from 'react';
import { User, MapPin, Mail, Phone, ShoppingBag, DollarSign, LogOut, Settings, Clock, Package } from 'lucide-react';
import { NavLink } from 'react-router-dom';

// --- Datos de Perfil de Ejemplo ---
const mockUser = {
  name: "Sofía Martínez",
  email: "sofia.martinez@komorebi.com",
  phone: "+57 310 123 4567",
  location: "Bogotá, Colombia",
  avatarUrl: "https://via.placeholder.com/150/FFD464/282828?text=SM", // Placeholder usando komorebi-yellow
  memberSince: "Enero 2024",
  lifetimeSpend: 450000,
  totalOrders: 15,
};

// Formato de precio para Colombia
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};

// --- Componentes Auxiliares para las Pestañas ---

const ProfileInfo: React.FC = () => (
  <div className="space-y-8">
    
    {/* Tarjetas de Métricas Rápidas */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <MetricCard 
        icon={ShoppingBag} 
        title="Órdenes Totales" 
        value={mockUser.totalOrders.toString()}
        color="--komorebi-yellow"
      />
      <MetricCard 
        icon={DollarSign} 
        title="Gasto Total" 
        value={formatPrice(mockUser.lifetimeSpend)}
        color="--komorebi-pink"
        isMoney
      />
      <MetricCard 
        icon={Clock} 
        title="Miembro Desde" 
        value={mockUser.memberSince}
        color="--komorebi-black"
      />
    </div>

    {/* Panel de Contacto y Configuración */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Información de Contacto */}
      <div className="md:col-span-2 bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold mb-5" style={{ color: 'var(--komorebi-black)' }}>
          Detalles de Contacto
        </h3>
        
        <InfoItem icon={Mail} label="Email" value={mockUser.email} color="--komorebi-pink" />
        <InfoItem icon={Phone} label="Teléfono" value={mockUser.phone} color="--komorebi-pink" />
        <InfoItem icon={MapPin} label="Ubicación" value={mockUser.location} color="--komorebi-pink" />
        
        <button className="mt-8 w-full md:w-auto bg-[var(--komorebi-black)] text-white px-6 py-3 rounded-full hover:bg-[var(--komorebi-pink)] transition-colors font-semibold shadow-md">
          <Settings size={20} className="inline mr-2" /> Ajustes de Cuenta
        </button>
      </div>

      {/* Tarjeta de Acciones */}
      <div className="bg-[var(--komorebi-yellow)] p-8 rounded-2xl shadow-xl flex flex-col justify-between">
          <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--komorebi-black)' }}>
            Acciones Rápidas
          </h3>
          <NavLink to="/cart">
            <ActionButton icon={ShoppingBag} label="Ver Carrito" color="--komorebi-black" />
          </NavLink>
          <NavLink to="/wishlist">
            <ActionButton icon={Package} label="Mis Favoritos" color="--komorebi-black" />
          </NavLink>
          <button 
            onClick={() => alert("Cerrando sesión...")}
            className="mt-6 w-full text-red-600 border-2 border-red-600 bg-white/50 py-2 rounded-full hover:bg-red-600 hover:text-white transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <LogOut size={20} /> Cerrar Sesión
          </button>
      </div>
    </div>
  </div>
);

// Componente para una tarjeta de métrica
const MetricCard: React.FC<{ icon: any, title: string, value: string, color: string, isMoney?: boolean }> = ({ icon: Icon, title, value, color, isMoney = false }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4" style={{ borderColor: `var(${color})` }}>
        <Icon size={28} style={{ color: `var(${color})` }} className="mb-2" />
        <p className="text-sm uppercase font-semibold text-gray-500">{title}</p>
        <p className={`text-3xl font-extrabold mt-1 ${isMoney ? 'text-[var(--komorebi-pink)]' : 'text-[var(--komorebi-black)]'}`}>
            {value}
        </p>
    </div>
);

// Componente para un ítem de información de contacto
const InfoItem: React.FC<{ icon: any, label: string, value: string, color: string }> = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100">
        <Icon size={20} style={{ color: `var(${color})` }} />
        <div>
            <p className="text-xs uppercase font-medium text-gray-500">{label}</p>
            <p className="text-base font-medium text-[var(--komorebi-black)]">{value}</p>
        </div>
    </div>
);

// Componente para un botón de acción rápida
const ActionButton: React.FC<{ icon: any, label: string, color: string }> = ({ icon: Icon, label, color }) => (
    <button 
        className="w-full mb-3 flex items-center gap-3 p-4 rounded-xl transition-all duration-200"
        style={{ color: `var(${color})`, backgroundColor: 'var(--komorebi-offwhite)' }}
    >
        <Icon size={24} />
        <span className="font-semibold text-lg">{label}</span>
    </button>
);


// Componente de simulación para Órdenes
const OrdersHistory: React.FC = () => (
  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
    <h3 className="text-3xl font-bold mb-6" style={{ color: 'var(--komorebi-black)' }}>
      Historial de Órdenes Recientes
    </h3>
    <ul className="space-y-4">
      {[
        { id: 'KM1024', date: '15/10/2025', items: 3, total: 45000, status: 'Entregado', color: 'text-green-600' },
        { id: 'KM1023', date: '01/10/2025', items: 1, total: 12000, status: 'Enviado', color: 'text-blue-600' },
        { id: 'KM1022', date: '20/09/2025', items: 5, total: 98500, status: 'Entregado', color: 'text-green-600' },
        { id: 'KM1021', date: '05/09/2025', items: 2, total: 35000, status: 'Cancelado', color: 'text-red-600' },
      ].map((order) => (
        <li key={order.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-lg transition-shadow hover:shadow-md">
          <div className="mb-2 sm:mb-0">
            <p className="font-bold text-lg" style={{ color: 'var(--komorebi-pink)' }}>
              #{order.id}
            </p>
            <p className="text-sm text-gray-500">
              {order.items} productos | {order.date}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-extrabold text-xl" style={{ color: 'var(--komorebi-black)' }}>
              {formatPrice(order.total)}
            </span>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-opacity-10 ${order.color}`} style={{ backgroundColor: 'var(--komorebi-yellow)', color: order.color }}>
              {order.status}
            </span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

// Componente de simulación para Ventas
const SellingDashboard: React.FC = () => (
  <div className="bg-[var(--komorebi-green)] p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
    <DollarSign size={48} className="mx-auto mb-4" style={{ color: 'var(--komorebi-black)' }} />
    <h3 className="text-3xl font-bold mb-4" style={{ color: 'var(--komorebi-black)' }}>
      Conviértete en Vendedor Komorebi
    </h3>
    <p className="text-lg text-gray-700 max-w-xl mx-auto mb-6">
      ¡Es simple! Lista tus snacks únicos y llega a miles de amantes de la comida.
    </p>
    <button className="bg-[var(--komorebi-pink)] text-white px-8 py-3 rounded-full hover:bg-[var(--komorebi-black)] transition-colors font-bold shadow-xl flex items-center gap-2 mx-auto">
      <DollarSign size={20} /> Empezar a Vender
    </button>
  </div>
);

// --- Componente Principal ---

const TABS = [
  { id: 'profile', label: 'Mi Perfil', icon: User, content: <ProfileInfo /> },
  { id: 'orders', label: 'Historial', icon: ShoppingBag, content: <OrdersHistory /> },
  { id: 'selling', label: 'Vender', icon: DollarSign, content: <SellingDashboard /> },
];


const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <div className="container mx-auto px-4 py-12" style={{ minHeight: 'calc(100vh - 200px)' }}>
      
      {/* Header del Perfil - Más limpio */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white">
        <div className="flex items-center gap-6">
          <img 
            src={mockUser.avatarUrl} 
            alt="Avatar" 
            className="w-24 h-24 rounded-full border-4 border-[var(--komorebi-pink)] object-cover shadow-lg"
          />
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: 'var(--komorebi-black)' }}>
              {mockUser.name}
            </h1>
            <p className="text-gray-500 text-lg">Cuenta de Cliente Komorebi</p>
          </div>
        </div>
      </div>

      {/* Navegación de Pestañas Estética */}
      <div className="mb-8">
        <nav className="flex space-x-2 md:space-x-4 border-b border-gray-200 overflow-x-auto whitespace-nowrap">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  inline-flex items-center gap-2 px-5 py-3 text-lg font-bold transition-all duration-300
                  ${isActive
                    ? 'text-[var(--komorebi-black)] border-b-4 border-[var(--komorebi-pink)] bg-white/70 shadow-sm rounded-t-lg'
                    : 'text-gray-500 hover:text-[var(--komorebi-pink)] hover:bg-gray-50/70'
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
      <div className="pt-4">
        {TABS.find(tab => tab.id === activeTab)?.content}
      </div>

    </div>
  );
};

export default ProfilePage;