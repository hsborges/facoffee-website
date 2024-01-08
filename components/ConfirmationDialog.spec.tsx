import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ConfirmationDialog } from './ConfirmationDialog';

describe('ConfirmationDialog', () => {
  const onCancel = jest.fn();
  const onConfirm = jest.fn();

  const Wrapper = (props: { isOpen: boolean }) => (
    <ConfirmationDialog
      code="12345"
      isOpen={props.isOpen}
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <br />
    </ConfirmationDialog>
  );

  beforeEach(async () => Promise.all([onCancel.mockClear(), onConfirm.mockClear()]));

  it('deve mostrar dialog se isOpen=true', async () => {
    render(<Wrapper isOpen={true} />);
    await expect(screen.findByTestId('dialog-content')).resolves.toBeDefined();
  });

  it('deve ocultar dialog se isOpen=false', async () => {
    render(<Wrapper isOpen={false} />);
    await expect(screen.findByTestId('dialog-content')).rejects.toBeDefined();
  });

  it('deve executar onCancel callback ao fechar dialog', async () => {
    render(<Wrapper isOpen={true} />);
    await userEvent.click(screen.getByTestId('dialog-close-button'));
    expect(onCancel).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('deve habilitar botão somente se código estiver correto', async () => {
    render(<Wrapper isOpen={true} />);

    fireEvent.change(screen.getByTestId('dialog-code-input'), { target: { value: '1234' } });
    expect(screen.getByTestId('dialog-confirm-button')).toBeDisabled();

    fireEvent.change(screen.getByTestId('dialog-code-input'), { target: { value: '123456' } });
    expect(screen.getByTestId('dialog-confirm-button')).toBeDisabled();

    fireEvent.change(screen.getByTestId('dialog-code-input'), { target: { value: '12345' } });
    expect(screen.getByTestId('dialog-confirm-button')).toBeEnabled();
  });

  it('deve executar onConfirm ao confirmar código', async () => {
    render(<Wrapper isOpen={true} />);

    fireEvent.change(screen.getByTestId('dialog-code-input'), { target: { value: '12345' } });
    expect(screen.getByTestId('dialog-confirm-button')).toBeEnabled();

    await userEvent.click(screen.getByTestId('dialog-confirm-button'));
    expect(onCancel).not.toHaveBeenCalled();
    expect(onConfirm).toHaveBeenCalled();
  });
});
