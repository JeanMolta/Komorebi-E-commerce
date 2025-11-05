import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { 
  loginUser, 
  selectAuthLoading, 
  selectAuthError, 
  selectIsAuthenticated,
  clearError
} from '../store/slices/authSlice'

const SignIn: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  
  const isLoading = useAppSelector(selectAuthLoading)
  const error = useAppSelector(selectAuthError)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  // Redirect to home if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(loginUser(formData))
  }

  return (
    <div className="min-h-screen bg-[var(--komorebi-offwhite)] pt-20">
      <div className="max-w-md mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[var(--komorebi-yellow)] text-3xl font-bold mb-2">Komorebi</h1>
          <p className="text-[var(--komorebi-black)]/60 text-sm">Welcome back to the marketplace</p>
          
          <h2 className="text-2xl font-bold text-[var(--komorebi-black)] mt-6 mb-2">Sign In</h2>
          <p className="text-[var(--komorebi-black)]/60 text-sm">Enter your credentials to access your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Demo Credentials Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-800 mb-2">Demo Credentials:</h4>
          <p className="text-sm text-blue-700">Email: demo@komorebi.com</p>
          <p className="text-sm text-blue-700">Password: password123</p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 bg-gray-200 rounded-lg border-none outline-none text-[var(--komorebi-black)] placeholder:text-[var(--komorebi-black)]/50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 bg-gray-200 rounded-lg border-none outline-none text-[var(--komorebi-black)] placeholder:text-[var(--komorebi-black)]/50"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-lg font-bold text-white transition-all mt-6 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[var(--komorebi-green)] hover:bg-[var(--komorebi-green)]/90'
            }`}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-6">
          <span className="text-[var(--komorebi-black)]/60 text-sm">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-[var(--komorebi-yellow)] hover:underline font-medium"
            >
              Create one
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default SignIn