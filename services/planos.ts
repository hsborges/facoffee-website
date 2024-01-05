import useSWR from 'swr';

import { httpClient } from '../util/http-client';

export const urls = {
  lista: '/api/planos',
  get: '/api/planos/:id',
};

export type Plano = {
  id: string;
  nome: string;
  descricao: string;
  valor: number;
  ativo: boolean;
};

export const usePlanos = function (ativo = true) {
  return useSWR<Array<Plano>>(
    [urls.lista, ativo],
    ([url, ativo]: [string, boolean]) =>
      httpClient
        .get(url, { params: { ativo } })
        .then((res) => res.data.sort((a: Plano, b: Plano) => a.valor - b.valor)),
    { refreshInterval: 1000 * 60 },
  );
};

export const usePlano = function (id: string | null = null) {
  return useSWR<Plano>(
    id && [urls.get, id],
    ([url, id]: [string, string]) => httpClient.get(url.replace(':id', id)).then((res) => res.data),
    { refreshInterval: 1000 * 60 },
  );
};
