import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import HeaderNav from '@/components/HeaderNav';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TheFork - Restaurant Recommendations',
  description: 'Find the best restaurants in Madrid',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <HeaderNav />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="bg-[#006B5A] text-white mt-12">
              <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-bold mb-4">About TheFork</h3>
                    <p className="text-gray-200 text-sm">
                      TheFork (formerly ElTenedor) is a restaurant booking platform with
                      thousands of restaurants available across Madrid and other Spanish cities.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-gray-200 text-sm">
                      <li>
                        <a href="#" className="hover:text-white transition-colors">Best Restaurants</a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-white transition-colors">Special Offers</a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-white transition-colors">Restaurant Rewards</a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-white transition-colors">Private Dining</a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-4">Contact</h3>
                    <p className="text-gray-200 text-sm">
                      Email: contact@thefork.es<br />
                      Phone: +34 900 123 456<br />
                      Address: Madrid, Spain
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-300">
                  <p>© {new Date().getFullYear()} TheFork. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#ffffff',
                color: '#333333',
                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                padding: '16px',
              },
              success: {
                style: {
                  border: '1px solid #dcfce7',
                  borderLeft: '4px solid #16a34a',
                },
              },
              error: {
                style: {
                  border: '1px solid #fee2e2',
                  borderLeft: '4px solid #ef4444',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
