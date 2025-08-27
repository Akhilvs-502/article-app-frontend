'use client';

import { useState } from 'react';
import Link from 'next/link';
import { userLogin } from '@/services/authService';
import { toastError, toastLite } from '@/utils/toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: '', // Can be email or phone
    password: ''
  });

    const router=useRouter()
  
  
  const [identifierType, setIdentifierType] = useState<'email' | 'phone'>('email');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleIdentifierTypeChange = (type: 'email' | 'phone') => {
    setIdentifierType(type);
    setFormData(prev => ({ ...prev, identifier: '' }));
    setErrors(prev => ({ ...prev, identifier: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = `${identifierType === 'email' ? 'Email' : 'Phone number'} is required`;
    } else if (identifierType === 'email' && !/\S+@\S+\.\S+/.test(formData.identifier)) {
      newErrors.identifier = 'Please enter a valid email address';
    } else if (identifierType === 'phone' && !/^\d{10,}$/.test(formData.identifier.replace(/\D/g, ''))) {
      newErrors.identifier = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const userData = await userLogin(formData)

        toastLite("login page success")
      router.push("/home")

      } catch (error) {
        console.log(error,"error while login page");

        
        toastError(error.response.data.message)
      }

      console.log('Login attempt:', { ...formData, identifierType });
      // You would typically send this data to your backend API
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your Article Hub account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identifier Type Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => handleIdentifierTypeChange('email')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${identifierType === 'email'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => handleIdentifierTypeChange('phone')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${identifierType === 'phone'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Phone
            </button>
          </div>

          {/* Identifier Input */}
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
              {identifierType === 'email' ? 'Email Address' : 'Phone Number'} *
            </label>
            <input
              type={identifierType === 'email' ? 'email' : 'tel'}
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.identifier ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder={`Enter your ${identifierType === 'email' ? 'email address' : 'phone number'}`}
            />
            {errors.identifier && <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 