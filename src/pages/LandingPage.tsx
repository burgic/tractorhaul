// src/pages/LandingPage.tsx

import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Find Tractor Inspectors & Hauliers
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Connect with qualified inspectors and reliable haulage services in your area.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => navigate('/signup')}
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/signin')}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Sign In <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage