import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { signIn } from 'supertokens-auth-react/recipe/emailpassword';

import { SigninForm } from './Authentication';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('supertokens-auth-react/recipe/emailpassword', () => ({
  signIn: jest.fn(),
}));

describe('Authentication', () => {
  const pushFn = jest.fn();

  beforeAll(() => (useRouter as jest.Mock).mockReturnValue({ push: pushFn }));

  afterEach(() => pushFn.mockClear());

  describe('SigninForm', () => {
    it('deve exibir link para cadastro', () => {
      render(<SigninForm signupUrl="http://localhost/registrar" redirectTo="/" />);
      expect(screen.getByRole('link')).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveProperty('href', 'http://localhost/registrar');
    });

    it('deve ser obrigatório informar email e senha', async () => {
      render(<SigninForm redirectTo="/" />);
      expect(screen.getByTestId('form-email')).toBeInvalid();
      expect(screen.getByTestId('form-password')).toBeInvalid();
    });

    it('deve informar email válido', () => {
      render(<SigninForm redirectTo="/" />);

      fireEvent.change(screen.getByTestId('form-email'), { target: { value: 'invalid-email' } });
      expect(screen.getByTestId('form-email')).toBeInvalid();

      fireEvent.change(screen.getByTestId('form-email'), { target: { value: 'valid@email.com' } });
      expect(screen.getByTestId('form-email')).toBeValid();

      userEvent.click(screen.getByTestId('form-submit'));

      expect(screen.getByTestId('form-email')).toBeValid();
    });

    it('deve informar senha de 8 digitos', async () => {
      render(<SigninForm redirectTo="/" />);

      fireEvent.change(screen.getByTestId('form-email'), { target: { value: 'valid@email.com' } });
      expect(screen.getByTestId('form-email')).toBeValid();

      fireEvent.change(screen.getByTestId('form-password'), { target: { value: '123' } });
      await userEvent.click(screen.getByTestId('form-submit'));
      expect(screen.getByTestId('form-password-error')).toBeInTheDocument();

      fireEvent.change(screen.getByTestId('form-password'), { target: { value: '12345678' } });
      await userEvent.click(screen.getByTestId('form-submit'));
      await expect(screen.findByTestId('form-password-error')).rejects.toBeDefined();

      fireEvent.change(screen.getByTestId('form-password'), { target: { value: '1234567890' } });
      await userEvent.click(screen.getByTestId('form-submit'));
      await expect(screen.findByTestId('form-password-error')).rejects.toBeDefined();
    });

    it('deve redirecionar para página de destino ao logar', async () => {
      (signIn as jest.Mock).mockResolvedValueOnce(Promise.resolve({ status: 'OK' }));
      render(<SigninForm redirectTo="/dashboard" />);

      fireEvent.change(screen.getByTestId('form-email'), { target: { value: 'valid@email.com' } });
      fireEvent.change(screen.getByTestId('form-password'), { target: { value: '12345678' } });

      await userEvent.click(screen.getByTestId('form-submit'));

      expect(pushFn).toHaveBeenCalledWith('/dashboard');
    });

    it('deve alertar usuário se email/senha estiverem incorretos', async () => {
      (signIn as jest.Mock).mockResolvedValueOnce(
        Promise.resolve({ status: 'WRONG_CREDENTIALS_ERROR' }),
      );
      render(<SigninForm redirectTo="/" />);

      fireEvent.change(screen.getByTestId('form-email'), { target: { value: 'valid@email.com' } });
      fireEvent.change(screen.getByTestId('form-password'), { target: { value: '12345678' } });

      await userEvent.click(screen.getByTestId('form-submit'));

      expect(screen.getByTestId('form-email-error')).toBeInTheDocument();
      expect(screen.getByTestId('form-password-error')).toBeInTheDocument();
    });

    it('deve marcar campos inválidos de acordo com o servidor', async () => {
      (signIn as jest.Mock).mockResolvedValueOnce(
        Promise.resolve({
          status: 'FIELD_ERROR',
          formFields: [
            { id: 'email', error: 'invalid email' },
            { id: 'password', error: 'very simple' },
          ],
        }),
      );
      render(<SigninForm redirectTo="/" />);

      fireEvent.change(screen.getByTestId('form-email'), { target: { value: 'valid@email.com' } });
      fireEvent.change(screen.getByTestId('form-password'), { target: { value: '12345678' } });

      await userEvent.click(screen.getByTestId('form-submit'));

      expect(screen.getByTestId('form-email-error')).toHaveTextContent('invalid email');
      expect(screen.getByTestId('form-password-error')).toHaveTextContent('very simple');
    });
  });
});
