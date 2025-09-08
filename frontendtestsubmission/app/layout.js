import './globals.css';

export const metadata = {
  title: 'URL Shortener',
  description: 'A minimal URL shortening service',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 flex items-center justify-center">
        {children}
      </body>
    </html>
  );
}