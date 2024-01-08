import classNames from 'classnames';
import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import numeral from 'numeral';

import './globals.css';
import { Providers } from './providers';

const rubik = Rubik({ subsets: ['latin'], variable: '--font-rubik' });

numeral.locale('pt-br');

export const metadata: Metadata = {
  title: 'Facoffee App',
  description: 'Aplicação para rateio de custos da FACOM',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={classNames(rubik.className, 'h-screen w-screen')}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
