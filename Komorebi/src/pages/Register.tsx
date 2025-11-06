import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { 
  registerUser, 
  selectAuthLoading, 
  selectAuthError, 
  selectRegistrationSuccess,
  clearError,
  clearRegistrationSuccess
} from '../store/slices/authSlice'
import type { RegisterData } from '../store/slices/authSlice'

const Register: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  
  const isLoading = useAppSelector(selectAuthLoading)
  const error = useAppSelector(selectAuthError)
  const registrationSuccess = useAppSelector(selectRegistrationSuccess)

  // Form state
  const [formData, setFormData] = useState<RegisterData & { confirmPassword: string }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    description: '',
    password: '',
    confirmPassword: ''
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError())
    dispatch(clearRegistrationSuccess())
  }, [dispatch])

  // Redirect to sign in on successful registration
  useEffect(() => {
    if (registrationSuccess) {
      setTimeout(() => {
        navigate('/signin')
      }, 2000)
    }
  }, [registrationSuccess, navigate])

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.firstName.trim()) errors.firstName = 'First name is required'
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email format is invalid'
    }
    if (!formData.phone.trim()) errors.phone = 'Phone number is required'
    if (!formData.location.trim()) errors.location = 'Location is required'
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm password is required'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear specific field error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const { confirmPassword, ...registerData } = formData
    dispatch(registerUser(registerData))
  }

  // Handle Google sign up (mock)
  const handleGoogleSignUp = () => {
    console.log('🔍 Google sign up clicked (not implemented)')
    alert('Google sign up will be implemented in the future')
  }

  return (
    <div className="min-h-screen bg-[var(--komorebi-offwhite)] ">
      <div className="max-w-md mx-auto px-4 py-8 pt-20">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/home" className="inline-block">
            <h1 className="text-[var(--komorebi-yellow)] text-3xl font-bold mb-2 hover:opacity-80 transition-opacity cursor-pointer">Komorebi</h1>
          </Link>
          <p className="text-[var(--komorebi-black)]/60 text-sm">Welcome back to the marketplace</p>
          
          <h2 className="text-2xl font-bold text-[var(--komorebi-black)] mt-6 mb-2">Create Account</h2>
          <p className="text-[var(--komorebi-black)]/60 text-sm">Fill in your information to get started</p>
        </div>

        {/* Success Message */}
        {registrationSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 text-center">
            <p className="font-medium">Account created successfully!</p>
            <p className="text-sm">Redirecting to sign in...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Gustavo"
                className={`w-full px-4 py-3 bg-gray-200 rounded-lg border-none outline-none text-[var(--komorebi-black)] placeholder:text-[var(--komorebi-black)]/50 ${
                  validationErrors.firstName ? 'bg-red-100 border-red-400' : ''
                }`}
              />
              {validationErrors.firstName && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Petro"
                className={`w-full px-4 py-3 bg-gray-200 rounded-lg border-none outline-none text-[var(--komorebi-black)] placeholder:text-[var(--komorebi-black)]/50 ${
                  validationErrors.lastName ? 'bg-red-100 border-red-400' : ''
                }`}
              />
              {validationErrors.lastName && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
              )}
            </div>
          </div>

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
              className={`w-full px-4 py-3 bg-gray-200 rounded-lg border-none outline-none text-[var(--komorebi-black)] placeholder:text-[var(--komorebi-black)]/50 ${
                validationErrors.email ? 'bg-red-100 border-red-400' : ''
              }`}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+57 000 000 0000"
              className={`w-full px-4 py-3 bg-gray-200 rounded-lg border-none outline-none text-[var(--komorebi-black)] placeholder:text-[var(--komorebi-black)]/50 ${
                validationErrors.phone ? 'bg-red-100 border-red-400' : ''
              }`}
            />
            {validationErrors.phone && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Country, Region, City"
              className={`w-full px-4 py-3 bg-gray-200 rounded-lg border-none outline-none text-[var(--komorebi-black)] placeholder:text-[var(--komorebi-black)]/50 ${
                validationErrors.location ? 'bg-red-100 border-red-400' : ''
              }`}
            />
            {validationErrors.location && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.location}</p>
            )}
          </div>

          {/* Description (Optional) */}
          <div>
            <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell a little bit about yourself..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-200 rounded-lg border-none outline-none text-[var(--komorebi-black)] placeholder:text-[var(--komorebi-black)]/50 resize-none"
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
              placeholder="Create a strong password"
              className={`w-full px-4 py-3 bg-gray-200 rounded-lg border-none outline-none text-[var(--komorebi-black)] placeholder:text-[var(--komorebi-black)]/50 ${
                validationErrors.password ? 'bg-red-100 border-red-400' : ''
              }`}
            />
            {validationErrors.password && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--komorebi-black)] mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              className={`w-full px-4 py-3 bg-gray-200 rounded-lg border-none outline-none text-[var(--komorebi-black)] placeholder:text-[var(--komorebi-black)]/50 ${
                validationErrors.confirmPassword ? 'bg-red-100 border-red-400' : ''
              }`}
            />
            {validationErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
            )}
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-[var(--komorebi-black)]/60">OR CONTINUE WITH</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Sign Up */}
        <button
          onClick={handleGoogleSignUp}
          className="w-full py-4 bg-white border border-gray-300 rounded-lg font-medium text-[var(--komorebi-black)] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-xl">G</span>
          Google
        </button>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <span className="text-[var(--komorebi-black)]/60 text-sm">
            Already have an account?{' '}
            <Link 
              to="/signin" 
              className="text-[var(--komorebi-yellow)] hover:underline font-medium"
            >
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Register