import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PasswordInput } from './PasswordInput';

describe('PasswordInput', () => {
  it('deve ocultar a senha por padrão', () => {
    render(<PasswordInput />);
    expect(screen.getByTestId('input')).toHaveProperty('type', 'password');
  });

  it('deve mostrar a senha ao clicar no ícone', async () => {
    render(<PasswordInput />);
    expect(screen.getByTestId('input')).toHaveProperty('type', 'password');

    await userEvent.click(screen.getByTestId('button'));

    expect(screen.getByTestId('input')).toHaveProperty('type', 'text');
  });

  it('deve permitir a entrada de texto', async () => {
    render(<PasswordInput />);
    await expect(screen.findByDisplayValue('12345')).rejects.toThrow();

    fireEvent.change(screen.getByTestId('input'), { target: { value: '12345' } });

    expect(screen.getByTestId('input')).toHaveProperty('value', '12345');

    await expect(screen.findByDisplayValue('12345')).resolves.toBeDefined();
  });
});
