import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';

import './globals.css';
import { Providers } from './providers';

const rubik = Rubik({ subsets: ['latin'], variable: '--font-rubik' });

export const metadata: Metadata = {
  title: 'Facoffee App',
  description: 'Aplicação para rateio de custos da FACOM',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={rubik.className + ' w-screen h-screen'}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
