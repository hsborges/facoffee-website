import dayjs from 'dayjs';

export function moeda(value: number) {
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
    .format(value)
    .replace('\xa0', ' ');
}

export function data(value: string | number | Date, full = false) {
  return dayjs(value).format(full ? 'DD/MM/YYYY [às] HH:mm:ss' : 'DD/MM/YYYY');
}
