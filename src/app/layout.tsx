import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Excel Data Processor – Порівняй та проаналізуй дані',
  description:
    'Зручний інструмент для обробки та порівняння Excel-файлів онлайн. Завантажте два файли, оберіть колонки для зіставлення, перегляньте зведену таблицю та експортуйте результат у форматі Excel.',
  keywords: [
    'Excel порівняння',
    'обробка Excel онлайн',
    'зведена таблиця Excel',
    'аналіз Excel файлів',
    'порівняння таблиць',
    'групування даних Excel',
    'sum by key Excel',
    'об’єднання Excel таблиць',
    'експорт у Excel',
    'React Excel parser',
  ],
  authors: [{ name: 'Євгенія', url: 'https://github.com/Evgenija-P' }],
  creator: 'Євгенія',

  openGraph: {
    title: 'Excel Data Processor – Порівняй та експортуй дані',
    description:
      'Онлайн-інструмент для порівняння Excel-файлів: унікальні значення, підрахунок кількості та сум, зручна таблиця з експортом у .xlsx.',
    url: 'https://data-processor.netlify.app/',
    siteName: 'Excel Data Processor',
    locale: 'uk_UA',
    type: 'website',
    images: [
      {
        url: 'https://data-processor.netlify.app/data-processing.png',
        width: 300,
        height: 500,
        alt: 'Excel Data Processor – приклад результату',
      },
    ],
  },

  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} bg-gray-500 antialiased`}>{children}</body>
    </html>
  );
}
