import { get } from 'lodash';
import useSWR from 'swr';

import { httpClient } from '../util/http-client';
import { Plano } from './planos';

export const urls = {
  ultima: '/api/assinaturas/ultima',
  inscrever: '/api/assinaturas/inscrever',
  cancelar: '/api/assinaturas/cancelar',
};

export type Assinatura = {
  id: string;
  usuario: string;
  plano: string;
  inicio_em: Date;
  fim_em: Date;
  status: 'ativa' | 'cancelada' | 'finalizada';
  encerrada_em: Date;
};

export const useAssinatura = function () {
  return useSWR<Assinatura>(urls.ultima, (url) => httpClient.get(url).then((res) => res.data), {
    refreshInterval: 1000 * 60,
  });
};

export const inscrever = async function (plano: Plano, duracao?: number) {
  return httpClient
    .post<Assinatura>(urls.inscrever, { plano: plano.id, duracao })
    .then((res) => res.data)
    .catch((error) =>
      Promise.reject(new Error(get(error, 'response.data.message', error.message))),
    );
};

export const cancelarInscricao = async function () {
  return httpClient
    .post<Assinatura>(urls.cancelar)
    .then((res) => res.data)
    .catch((error) =>
      Promise.reject(new Error(get(error, 'response.data.message', error.message))),
    );
};
