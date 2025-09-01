'use client';

import { useState } from 'react';
import Link from 'next/link';
import { userRegister } from '@/services/authService';
import { verifyOtpService } from '@/services/verifyOtpService';
import { toastLite } from '@/utils/toast';
import { useRouter } from 'next/navigation';


const articleCategories = [
  'Sports',
  'Politics',
  'Space',
  'Technology',
  'Health',
  'Science',
  'Entertainment',
  'Business',
  'Education',
  'Environment'
];

type SignupStep = 'basic' | 'otp' | 'preferences';

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<SignupStep>('preferences');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
    preferences: [] as string[]
  }); 

  const router=useRouter()
  const [otp, setOtp] = useState(['', '', '', '','','']);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Real-time validation for specific fields
    if (name === 'email' && value.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      }
    }
    
    if (name === 'phone' && value.trim()) {
      const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
      if (!/^[\+]?[1-9][\d]{0,15}$/.test(cleanPhone) || cleanPhone.length < 10) {
        setErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number' }));
      }
    }
    
    if ((name === 'firstName' || name === 'lastName') && value.trim()) {
      if (value.trim().length < 2) {
        setErrors(prev => ({ ...prev, [name]: `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters long` }));
      } else if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
        setErrors(prev => ({ ...prev, [name]: `${name === 'firstName' ? 'First' : 'Last'} name can only contain letters, spaces, hyphens, and apostrophes` }));
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handlePreferenceChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(category)
        ? prev.preferences.filter(p => p !== category)
        : [...prev.preferences, category]
    }));
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[!@#$%^&*])/.test(password)) score++;

    const strengthMap = [
      { label: 'Very Weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Fair', color: 'bg-yellow-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Strong', color: 'bg-green-500' }
    ];

    return { score, ...strengthMap[Math.min(score - 1, 4)] };
  };

  const validateBasicStep = () => {
    const newErrors: Record<string, string> = {};

    // First Name Validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters long';
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes';
    }

    // Last Name Validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters long';
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
    }

    // Phone Number Validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    } else if (formData.phone.replace(/[\s\-\(\)]/g, '').length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits long';
    }

    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    } else if (formData.email.trim().length > 254) {
      newErrors.email = 'Email address is too long';
    }

    // Date of Birth Validation
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      if (age < 13) {
        newErrors.dob = 'You must be at least 13 years old to register';
      } else if (age > 120) {
        newErrors.dob = 'Please enter a valid date of birth';
      } else if (dob > today) {
        newErrors.dob = 'Date of birth cannot be in the future';
      }
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    // Confirm Password Validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtpStep = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setErrors({ otp: 'Please enter the complete 6-digit OTP' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validatePreferencesStep = () => {
    if (formData.preferences.length === 0) {
      setErrors({ preferences: 'Please select at least one category' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNextStep =async () => {
    if (currentStep === 'preferences' && validatePreferencesStep()) {
      setCurrentStep('basic');
    } else if (currentStep === 'basic' && validateBasicStep()) {

    try{
      await userRegister(formData)
      setCurrentStep('otp');
      
    }catch(error: unknown){
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response: { data: { message: string } } };
          toastLite(axiosError.response.data.message);
        }
      
    }

      console.log('Sending OTP to:', formData.phone);
    } else if (currentStep === 'otp' && validateOtpStep()) {
      console.log('Verifying OTP:', otp.join(''));
   
      try{

        await verifyOtpService({email:formData.email,otp})

      
        toastLite("otp verified success")
        
        // Registration complete - redirect to login
        toastLite('Registration successful! Welcome to Article Hub!');
        router.push("/auth/login")

      }catch(error: unknown){
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response: { data: { message: string } } };
          console.log("erro3", axiosError.response.data.message);
        }

        
      }

    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 'basic') {
      setCurrentStep('preferences');
    } else if (currentStep === 'otp') {
      setCurrentStep('basic');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is now handled in handleNextStep for OTP verification
  };

  const renderBasicStep = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Join Article Hub</h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Share your stories, discover amazing articles, and connect with writers who share your interests.
        </p>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-0 ${
                errors.firstName 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              placeholder="e.g., John"
            />
            {errors.firstName && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-0 ${
                errors.lastName 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              placeholder="e.g., Smith"
            />
            {errors.lastName && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-0 ${
                errors.phone 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              placeholder="e.g., +1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-0 ${
                errors.email 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              placeholder="e.g., john@example.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dob" className="block text-sm font-semibold text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
            className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 transition-all duration-200 focus:outline-none focus:ring-0 ${
              errors.dob 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-200 focus:border-blue-500'
            }`}
          />
          <p className="text-xs text-gray-500 mt-1">
            You must be at least 13 years old to register
          </p>
          {errors.dob && (
            <p className="text-red-600 text-sm mt-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.dob}
            </p>
          )}
        </div>

        {/* Security Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Password Security Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use at least 8 characters</li>
            <li>• Include uppercase and lowercase letters</li>
            <li>• Add numbers and special characters</li>
            <li>• Avoid common words and personal information</li>
          </ul>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
            <input
                type={showPasswords.password ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
                className={`w-full px-4 py-3 pr-12 border-2 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-0 ${
                errors.password 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              placeholder="Create a password"
            />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPasswords.password ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full ${
                          level <= getPasswordStrength(formData.password).score 
                            ? getPasswordStrength(formData.password).color 
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-sm font-medium ${
                    getPasswordStrength(formData.password).score >= 4 ? 'text-green-600' : 
                    getPasswordStrength(formData.password).score >= 3 ? 'text-blue-600' : 
                    getPasswordStrength(formData.password).score >= 2 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {getPasswordStrength(formData.password).label}
                  </span>
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
            <input
                type={showPasswords.confirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
                className={`w-full px-4 py-3 pr-12 border-2 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-0 ${
                errors.confirmPassword 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              placeholder="Confirm your password"
            />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleNextStep}
        className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold text-lg shadow-sm hover:shadow-md"
      >
        Continue to Verification
      </button>
    </div>
  );

  const renderOtpStep = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Phone</h2>
        <p className="text-gray-600">
          We&apos;ve sent a 4-digit verification code to{' '}
          <span className="font-semibold text-gray-900">{formData.email}</span>
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
            Enter the verification code
          </label>
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-0 transition-all duration-200"
                placeholder="0"
              />
            ))}
          </div>
          {errors.otp && (
            <p className="text-red-600 text-sm mt-3 text-center flex items-center justify-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.otp}
            </p>
          )}
        </div>

        <div className="text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Didn&apos;t receive the code? Resend
          </button>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={handlePreviousStep}
          className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNextStep}
          className="flex-1 bg-gray-900 text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
        >
          Complete Registration
        </button>
      </div>
    </div>
  );

  const renderPreferencesStep = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Interests</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Select the topics you&apos;re passionate about. We&apos;ll personalize your experience and show you the most relevant articles.
        </p>
      </div>

      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {articleCategories.map((category) => (
            <label key={category} className="relative cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.preferences.includes(category)}
                onChange={() => handlePreferenceChange(category)}
                className="sr-only"
              />
              <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                formData.preferences.includes(category)
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}>
                <div className="text-center">
                  <div className={`w-6 h-6 rounded-full border-2 mx-auto mb-2 transition-all duration-200 ${
                    formData.preferences.includes(category)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {formData.preferences.includes(category) && (
                      <svg className="w-4 h-4 text-white mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium text-sm">{category}</span>
                </div>
              </div>
            </label>
          ))}
        </div>
        {errors.preferences && (
          <p className="text-red-600 text-sm mt-3 text-center flex items-center justify-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.preferences}
          </p>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={handlePreviousStep}
          className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNextStep}
          className="flex-1 bg-gray-900 text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
        >
          Continue to Personal Info
        </button>
      </div>
    </div>
  );

  const renderProgressBar = () => (
    <div className="mb-12">
      <div className="flex items-center justify-center space-x-4">
        {['preferences', 'basic', 'otp'].map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                currentStep === step
                  ? 'bg-gray-900 text-white scale-110'
                  : index < ['preferences', 'basic', 'otp'].indexOf(currentStep)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
            {index < 2 && (
              <div
                className={`w-20 h-1 mx-4 transition-all duration-300 ${
                  index < ['preferences', 'basic', 'otp'].indexOf(currentStep)
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <span className="text-sm font-medium text-gray-500">
          {currentStep === 'preferences' && 'Topic Selection'}
          {currentStep === 'basic' && 'Personal Information'}
          {currentStep === 'otp' && 'Phone Verification'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {renderProgressBar()}

          <form onSubmit={handleSubmit}>
            {currentStep === 'preferences' && renderPreferencesStep()}
            {currentStep === 'basic' && renderBasicStep()}
            {currentStep === 'otp' && renderOtpStep()}
          </form>

          {currentStep === 'preferences' && (
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 