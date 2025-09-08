'use client';

import { useState } from 'react';

export default function ShortenPage() {
  const [url, setUrl] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [error, setError] = useState('');
  const [validity, setValidity] = useState(30);
  const [shortcode, setShortcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortLink('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/shorturls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, validity, shortcode }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create short URL: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setShortLink(data.shortLink);
    } catch (err) {
      setError(err.message || 'An error occurred while contacting the server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-2 tracking-tight">
            URL Shortener
          </h1>
          <p className="text-gray-500 text-sm font-light">
            Transform long URLs into short, shareable links
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Input */}
            <div className="group">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Original URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-long-url.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                required
              />
            </div>

            {/* Advanced Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="validity" className="block text-sm font-medium text-gray-700 mb-2">
                  Expires in (minutes)
                </label>
                <input
                  type="number"
                  id="validity"
                  value={validity}
                  onChange={(e) => setValidity(parseInt(e.target.value) || 30)}
                  min="1"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="shortcode" className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Code
                </label>
                <input
                  type="text"
                  id="shortcode"
                  value={shortcode}
                  onChange={(e) => setShortcode(e.target.value)}
                  placeholder="optional"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                'Create Short Link'
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Result */}
          {shortLink && (
            <div className="mt-6 p-6 bg-green-50 border border-green-100 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <p className="text-green-800 font-medium text-sm">Your shortened URL:</p>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                <a 
                  href={shortLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 text-blue-600 hover:text-blue-800 font-mono text-sm truncate transition-colors"
                >
                  {shortLink}
                </a>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-xs font-light">
            Links expire automatically for your security
          </p>
        </div>
      </div>
    </div>
  );
}