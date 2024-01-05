'use client';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';

export function ConfirmationDialog(props: {
  code: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConfirm = useCallback(() => {
    setLoading(true);
    props.onConfirm();
  }, [setLoading, props]);

  useEffect(() => {
    setLoading(false);
    setEnabled(false);
  }, [props.isOpen]);

  return (
    <AlertDialog
      isOpen={props.isOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => !loading && props.onCancel()}
      closeOnEsc={!loading}
      closeOnOverlayClick={!loading}
    >
      <AlertDialogOverlay>
        <AlertDialogContent data-testid="dialog-content">
          <AlertDialogHeader>Confirmar ação</AlertDialogHeader>
          <AlertDialogCloseButton data-testid="dialog-close-button" />
          <AlertDialogBody>
            <div className="border-t-2 border-t-gray-100 mt-[-15px] py-4 flex justify-center">
              {props.children}
            </div>
            <div className="border-t-2 border-t-gray-100 pt-4">
              <span className="text-sm text-gray-500">
                Para confirmar, escreva &quot;{props.code}&quot; no campo abaixo
              </span>
              <Input
                size="sm"
                onChange={(e) => setEnabled(e.target.value === props.code)}
                borderColor={enabled ? 'gray.300' : 'red.200'}
                focusBorderColor={enabled ? 'gray.300' : 'red.200'}
                data-testid="dialog-code-input"
              />
            </div>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              isDisabled={!enabled}
              isLoading={loading}
              onClick={onConfirm}
              size="sm"
              color={enabled ? 'red.500' : 'red.400'}
              width="100%"
              data-testid="dialog-confirm-button"
            >
              Confirmar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
