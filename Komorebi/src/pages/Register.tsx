import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks'; // Asumiendo que tienes estos hooks personalizados
import { 
  registerUser, 
  clearError,
  clearRegistrationSuccess,
  selectAuthLoading, 
  selectAuthError, 
  selectRegistrationSuccess,
  selectIsAuthenticated 
} from '../store/slices/authSlice';
import type { RegisterData } from '../store/slices/authSlice'; // Importar el tipo de datos

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const registrationSuccess = useAppSelector(selectRegistrationSuccess);
  const isAuthenticated = useAppSelector(selectIsAuthenticated); // Para evitar que usuarios logueados accedan

  const [formData, setFormData] = useState<RegisterData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    description: '',
    password: ''
  });

  // Limpiar errores y éxito de registro al montar
  useEffect(() => {
    dispatch(clearError());
    dispatch(clearRegistrationSuccess());
  }, [dispatch]);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Redirigir si el registro fue exitoso (el thunk te autentica automáticamente)
  useEffect(() => {
    if (registrationSuccess) {
      // Navegamos al home y luego limpiamos el estado de éxito
      navigate('/home'); 
      dispatch(clearRegistrationSuccess());
    }
  }, [registrationSuccess, navigate, dispatch]);

  // Manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convertir el campo 'phone' a string, si no lo es ya
    const dataToSend = { ...formData, phone: String(formData.phone) };

    dispatch(registerUser(dataToSend));
  };

  return (
    <div className="min-h-screen bg-[var(--komorebi-offwhite)] py-8">
      <div className="max-w-xl mx-auto px-4 pt-16 pb-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/home" className="inline-block">
            <h1 className="text-[var(--komorebi-yellow)] text-3xl font-bold mb-2 hover:opacity-80 transition-opacity cursor-pointer">Komorebi</h1>
          </Link>
          <p className="text-[var(--komorebi-black)]/60 text-sm">Join the marketplace today</p>
          
          <h2 className="text-2xl font-bold text-[var(--komorebi-black)] mt-6 mb-2">Create Account</h2>
          <p className="text-[var(--komorebi-black)]/60 text-sm">Fill in your details to get started</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-200 rounded-3xl border-none outline-none text-[var(--komorebi-black)] placeholder:text-[var(--komorebi-black)]/50"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-200 rounded-3xl border-none outline-none text-[var(--komorebi-black)] placeholder:text-[var(--komorebi-black)]/50"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 bg-gray-200 rounded-3xl border-none outline-none text-[var(--komorebi-black)] placeholder:text-[var(--komorebi-black)]/50"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+57 300 000 0000"
              required
              className="w-full px-4 py-3 bg-gray-200 rounded-3xl border-none outline-none text-[var(--komorebi-black)] placeholder:text-[var(--komorebi-black)]/50"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, Country"
              required
              className="w-full px-4 py-3 bg-gray-200 rounded-3xl border-none outline-none text-[var(--komorebi-black)] placeholder:text-[var(--komorebi-black)]/50"
            />
          </div>
          
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Choose a secure password"
              required
              minLength={6}
              className="w-full px-4 py-3 bg-gray-200 rounded-3xl border-none outline-none text-[var(--komorebi-black)] placeholder:text-[var(--komorebi-black)]/50"
            />
          </div>
          
          {/* Description (Optional) */}
          <div className="pt-2">
            <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">About Me (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Tell us a little about your interests..."
              className="w-full px-4 py-3 bg-gray-200 rounded-2xl border-none outline-none text-[var(--komorebi-black)] placeholder:text-[var(--komorebi-black)]/50 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-3xl font-bold transition-all mt-6 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'btn-komorebi-yellow' // Asumiendo que esta clase existe
            }`}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <span className="text-[var(--komorebi-black)]/60 text-sm">
            Already have an account?{' '}
            <Link 
              to="/signin" 
              className="text-[var(--komorebi-yellow)] hover:underline font-medium"
            >
              Sign In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;