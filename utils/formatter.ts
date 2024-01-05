import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat).locale('pt-br');

export function currency(value: number) {
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function date(value: string | number | Date, short = false) {
  return dayjs(value).format(short ? 'LL' : 'LLL');
}
