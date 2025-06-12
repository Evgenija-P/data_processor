import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';


const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Excel Data Processor',
  description: 'Excel Data Processor',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} bg-gray-500 antialiased`}>
        {children}
      </body>
    </html>
  );
}
