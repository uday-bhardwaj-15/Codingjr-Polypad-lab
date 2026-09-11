import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PolyLab — Math Manipulatives Lab | CodingJr',
  description:
    'Next.js-native interactive math manipulatives lab with fractions, numbers, algebra, geometry, and probability.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
