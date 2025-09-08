import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-light text-gray-900 mb-4 tracking-tight">
            URL Shortener
          </h1>
          <p className="text-gray-500 text-lg font-light leading-relaxed">
            Transform your long URLs into clean, shareable links in seconds
          </p>
        </div>
        
        <Link 
          href="/shorten" 
          className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
          Get Started
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-400 text-sm font-light">
            No registration required • Links expire automatically
          </p>
        </div>
      </div>
    </div>
  );
}