import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PasswordInput } from './PasswordInput';

describe('PasswordInput', () => {
  it('deve ocultar a senha por padrão', () => {
    render(<PasswordInput />);

    expect(screen.getByTestId<HTMLInputElement>('input').type).toBe('password');
  });

  it('deve mostrar a senha ao clicar no ícone', async () => {
    render(<PasswordInput />);

    await userEvent.click(screen.getByTestId('button'));

    expect(screen.getByTestId<HTMLInputElement>('input').type).toBe('text');
  });

  it('deve permitir a entrada de texto', async () => {
    const { container } = render(<PasswordInput />);

    await expect(screen.findByDisplayValue('12345')).rejects.toThrow();

    fireEvent.change(container.querySelector('input') as HTMLInputElement, {
      target: { value: '12345' },
    });

    expect(screen.getByTestId<HTMLInputElement>('input')).toHaveProperty('value', '12345');

    await expect(screen.findByDisplayValue('12345')).resolves.toBeDefined();
  });
});
