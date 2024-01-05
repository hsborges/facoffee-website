import { data, moeda } from './formatter';

describe('Testa formatter', () => {
  describe('data()', () => {
    const offset = new Date().getTimezoneOffset() / 60;

    it('deve formatar datas de forma curta por padrao', () => {
      expect(data('2024-01-05T12:00:00Z')).toEqual('05/01/2024');
      expect(data(new Date(2024, 0, 5))).toEqual('05/01/2024');
      expect(data(new Date(2024, 0, 5).getTime())).toEqual('05/01/2024');
    });

    it('deve formatar datas com hora se full=true', () => {
      const resultado = `05/01/2024 às ${new String(12 - offset).padStart(2, '0')}:00:00`;
      expect(data('2024-01-05T12:00:00Z', true)).toEqual(resultado);
      expect(data(new Date(Date.UTC(2024, 0, 5, 12, 0, 0)), true)).toEqual(resultado);
      expect(data(Date.UTC(2024, 0, 5, 12, 0, 0), true)).toEqual(resultado);
    });
  });

  describe('moeda()', () => {
    it('deve formatar valores inteiros', () => {
      expect(moeda(0)).toEqual('R$ 0,00');
    });
    it('deve formatar valores decimais', () => {
      expect(moeda(0.1)).toEqual('R$ 0,10');
      expect(moeda(0.01)).toEqual('R$ 0,01');
    });
  });
});
