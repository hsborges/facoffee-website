import { sendDeposito } from '@/services/financeiro';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ComprovantePage from './page';

const pushFn = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(() => ({ push: pushFn })),
}));

jest.mock('../../../../services/financeiro');

describe('Page: ComprovantePage', () => {
  beforeAll(() => (sendDeposito as jest.Mock).mockResolvedValue(Promise.resolve()));
  beforeEach(() => jest.clearAllMocks());

  async function enviarFormulario(
    data: Partial<{ valor: string; comprovante: File; descricao: string }>,
  ) {
    fireEvent.change(screen.getByRole('textbox', { name: 'Valor' }), {
      target: { value: data.valor || '1,00' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'Descrição' }), {
      target: { value: data.descricao || 'teste' },
    });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (!Object.keys(data).includes('comprovante') || data.comprovante !== undefined) {
      await userEvent.upload(
        fileInput,
        data.comprovante ||
          new File([new Blob(['content'])], 'comprovante.txt', { type: 'text/plain' }),
      );
    }
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }));
  }

  it('referência deve ser auto-gerado e não alteravel', () => {
    render(<ComprovantePage />);
    const input = screen.getByRole('textbox', { name: 'Referência' });
    expect(input).toHaveProperty('value', expect.stringMatching(/^DEP\d*$/));
    expect(input).toHaveProperty('readOnly', true);
  });

  it('valor é obrigatório e deve seguir o formato monetario local e ser maior que 0', async () => {
    render(<ComprovantePage />);

    for (const valor of ['0', '0,00']) {
      await enviarFormulario({ valor: valor });
      expect(screen.getByText('Valor deve ser maior que zero')).toBeInTheDocument();
    }

    for (const valor of ['1.1', '1.00', '1,1', '1,1', '1,000', '1,000.00', '1,000,00']) {
      await enviarFormulario({ valor: valor });
      expect(screen.getByText('Não está na formatação correta')).toBeInTheDocument();
    }
  });

  it('deve redirecionar usuário para /me após enviar comprovante', async () => {
    render(<ComprovantePage />);
    await enviarFormulario({});
    expect(pushFn).toHaveBeenCalledWith('/me');
  });

  it('deve enviar dados não formatados para o serviço', async () => {
    render(<ComprovantePage />);
    const file = new File([new Blob(['content'])], 'comprovante.txt', { type: 'text/plain' });
    await enviarFormulario({ valor: '1.000,00', descricao: 'teste', comprovante: file });
    expect(sendDeposito).toHaveBeenCalledWith({
      referencia: expect.stringMatching(/^DEP\d*$/),
      valor: 1000,
      descricao: 'teste',
      comprovante: file,
    });
  });
});
