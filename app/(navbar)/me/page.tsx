'use client';

import { AssinaturaStatus } from './components/AssinaturaStatus';
import { Extrato } from './components/Extrato';

export default function Me() {
  return (
    <div className="flex justify-evenly items-center py-4 h-full">
      <AssinaturaStatus className="w-1/2" />
      <Extrato className="w-1/2 " />
    </div>
  );
}
