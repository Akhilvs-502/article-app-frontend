import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Article Hub</h1>
          <p className="text-gray-600">Your personalized article management platform</p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/home" 
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center font-medium"
          >
            Browse Articles
          </Link>
          
          <Link 
            href="/auth/register" 
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center font-medium"
          >
            Get Started
          </Link>
          
          <Link 
            href="/auth/login" 
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center font-medium"
          >
            Sign In
          </Link>
          
          <Link 
            href="/dashboard" 
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center font-medium"
          >
            View Dashboard (Demo)
          </Link>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Discover articles in sports, politics, space, and more based on your interests
          </p>
        </div>
      </div>
    </div>
  );
}
