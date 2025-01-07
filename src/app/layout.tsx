import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-light-yellow dark:bg-navy text-gray-900 dark:text-gray-100 min-h-screen`}>
        <main className="container mx-auto px-4 py-8 max-w-5xl h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}