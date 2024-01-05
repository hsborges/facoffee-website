import { render, screen } from '@testing-library/react';
import { SessionContextType } from 'supertokens-auth-react/recipe/session';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';

import Navbar from './Navbar';

jest.mock('supertokens-auth-react/recipe/session', () => ({
  ...jest.requireActual('supertokens-auth-react/recipe/session'),
  useSessionContext: jest.fn(() => ({ loading: true }) as SessionContextType),
}));

describe('Navbar', () => {
  it('deve mostrar botão de login quando estiver carregando', async () => {
    render(<Navbar />);
    await expect(screen.findByTestId('login-btn')).resolves.toBeDefined();
  });

  describe('quando não estiver logado', () => {
    beforeAll(() =>
      (useSessionContext as jest.Mock).mockReturnValue({
        loading: false,
        doesSessionExist: false,
      } as SessionContextType),
    );

    it('deve mostrar botão de login', async () => {
      render(<Navbar />);
      await expect(screen.findByTestId('login-btn')).resolves.toBeDefined();
    });
  });

  describe('quando estiver logado', () => {
    beforeAll(() =>
      (useSessionContext as jest.Mock).mockReturnValue({
        loading: false,
        doesSessionExist: true,
        accessTokenPayload: { first_name: 'John', last_name: 'Doe' },
      } as SessionContextType),
    );

    it('deve mostrar avatar do usuário', async () => {
      render(<Navbar />);
      await expect(screen.findByTestId('menu-btn')).resolves.toBeDefined();
    });

    it('não deve exibir badge de admin se não tiver permissão', async () => {
      render(<Navbar />);
      await expect(screen.findByTestId('admin-btn')).rejects.toBeDefined();
    });

    describe('se for admin', () => {
      beforeAll(() =>
        (useSessionContext as jest.Mock).mockReturnValueOnce({
          loading: false,
          doesSessionExist: true,
          accessTokenPayload: { first_name: 'John', last_name: 'Doe', roles: ['admin'] },
        } as SessionContextType),
      );

      it('deve mostrar badge de admin', async () => {
        render(<Navbar />);
        await expect(screen.findByTestId('admin-btn')).resolves.toBeDefined();
      });
    });
  });
});
