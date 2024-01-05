import useSWR from 'swr';

import { httpClient } from './client';

export const urls = {
  saldo: '/api/operacoes/saldo',
  extrato: '/api/operacoes/extrato',
  credito: '/api/operacoes/credito',
};

export type Operacao = {
  id: string;
  referencia: string;
  valor: number;
  emissor: string;
  usuario: string;
  descricao: string;
  data_emissao: string;
};

export type Debito = Operacao & { tipo: 'Debito' };

export type Credito = Operacao & {
  tipo: 'Credito';
  comprovante: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  revisado_em: string;
  revisado_por: string;
};

export type Saldo = {
  saldo: number;
  pendente: number;
};

export const useSaldo = function (usuario?: string) {
  return useSWR<Saldo>(
    [urls.saldo, usuario],
    ([url, usuario]: [string, string?]) =>
      httpClient.get(url, { params: { usuario } }).then((res) => res.data),
    { refreshInterval: 1000 * 60 },
  );
};

export const useExtrato = function (usuario?: string) {
  return useSWR<Array<Debito | Credito>>(
    [urls.extrato, usuario],
    ([url, usuario]: [string, string?]) =>
      httpClient.get(url, { params: { usuario } }).then((res) => res.data),
    { refreshInterval: 1000 * 60 },
  );
};

export const sendDeposito = async function (deposito: {
  referencia: string;
  valor: number;
  comprovante: File;
  descricao?: string;
}): Promise<Credito> {
  return httpClient.postForm<Credito>(urls.credito, deposito).then((res) => res.data);
};
