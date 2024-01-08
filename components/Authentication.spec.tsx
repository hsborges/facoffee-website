import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from 'supertokens-auth-react/recipe/emailpassword';

import { SigninForm, SignupForm } from './Authentication';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('supertokens-auth-react/recipe/emailpassword', () => ({
  signIn: jest.fn(),
  signUp: jest.fn(),
}));

type FormInfo = {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
};

function preencherFormulario(type: 'signin' | 'signup', data?: Partial<FormInfo>) {
  fireEvent.change(screen.getByTestId('form-email'), {
    target: { value: data?.email || 'valid@email.com' },
  });

  fireEvent.change(screen.getByTestId('form-password'), {
    target: { value: data?.password || '12345678' },
  });

  if (type === 'signup') {
    fireEvent.change(screen.getByTestId('form-first_name'), {
      target: { value: data?.first_name || 'valid' },
    });
    fireEvent.change(screen.getByTestId('form-last_name'), {
      target: { value: data?.last_name || 'valid' },
    });
    fireEvent.change(screen.getByTestId('form-confirm_password'), {
      target: { value: data?.confirm_password || '12345678' },
    });
  }
}

async function enviarFormulario(...props: Parameters<typeof preencherFormulario>) {
  preencherFormulario(...props);
  return userEvent.click(screen.getByTestId('form-submit'));
}

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

    it('deve informar email válido', async () => {
      render(<SigninForm redirectTo="/" />);

      await enviarFormulario('signin', { email: 'invalid-email' });
      expect(screen.getByTestId('form-email')).toBeInvalid();

      await enviarFormulario('signin', { email: 'valid@email.com' });
      expect(screen.getByTestId('form-email')).toBeValid();
    });

    it('deve informar senha de 8 digitos', async () => {
      render(<SigninForm redirectTo="/" />);

      await enviarFormulario('signin', { password: '123' });
      expect(screen.getByTestId('form-password-error')).toBeInTheDocument();

      await enviarFormulario('signin', { password: '12345678' });
      await expect(screen.findByTestId('form-password-error')).rejects.toBeDefined();

      await enviarFormulario('signin', { password: '1234567890' });
      await expect(screen.findByTestId('form-password-error')).rejects.toBeDefined();
    });

    it('deve redirecionar para página de destino ao logar', async () => {
      (signIn as jest.Mock).mockResolvedValueOnce(Promise.resolve({ status: 'OK' }));

      render(<SigninForm redirectTo="/dashboard" />);
      await enviarFormulario('signin');
      expect(pushFn).toHaveBeenCalledWith('/dashboard');
    });

    it('deve alertar usuário se email/senha estiverem incorretos', async () => {
      (signIn as jest.Mock).mockResolvedValueOnce(
        Promise.resolve({ status: 'WRONG_CREDENTIALS_ERROR' }),
      );

      render(<SigninForm redirectTo="/" />);
      await enviarFormulario('signin');
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
      await enviarFormulario('signin');
      expect(screen.getByTestId('form-email-error')).toHaveTextContent('invalid email');
      expect(screen.getByTestId('form-password-error')).toHaveTextContent('very simple');
    });
  });

  describe('SignupForm', () => {
    it('deve exibir link para login', () => {
      render(<SignupForm signinUrl="http://localhost/login" redirectTo="/" />);
      expect(screen.getByRole('link')).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveProperty('href', 'http://localhost/login');
    });

    it('deve ser obrigatório informar nome, sobrenome, email, senha e confirmar senha', async () => {
      render(<SignupForm redirectTo="/" />);
      await userEvent.click(screen.getByTestId('form-submit'));
      expect(screen.getByTestId('form-email')).toBeInvalid();
      expect(screen.getByTestId('form-password')).toBeInvalid();
      expect(screen.getByTestId('form-first_name')).toBeInvalid();
      expect(screen.getByTestId('form-last_name')).toBeInvalid();
      expect(screen.getByTestId('form-confirm_password')).toBeInvalid();
    });

    it('deve apresentar erro se as senhas não forem iguais', async () => {
      render(<SignupForm redirectTo="/" />);
      await enviarFormulario('signup', { confirm_password: '123456789' });
      expect(screen.getByTestId('form-confirm_password-error')).toBeInTheDocument();
    });

    it('deve redirecionar usuário ao cadastrar com sucesso', async () => {
      (signUp as jest.Mock).mockResolvedValueOnce(Promise.resolve({ status: 'OK' }));
      render(<SignupForm redirectTo="/dashboard" />);
      await enviarFormulario('signup');
      expect(pushFn).toHaveBeenCalledWith('/dashboard');
    });
  });
});
