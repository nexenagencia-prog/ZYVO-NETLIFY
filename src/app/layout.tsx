import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ZYVO — Reuniões com Performance Pro',
  description: 'Tecnologia para reuniões mais produtivas e inteligentes.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
