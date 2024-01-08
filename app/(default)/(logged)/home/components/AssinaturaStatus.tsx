'use client';

import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { cancelarInscricao, useAssinatura } from '@/services/assinatura';
import { usePlano } from '@/services/planos';
import { data, moeda } from '@/util/formatter';
import { Badge, Button, Highlight, SkeletonText, useToast } from '@chakra-ui/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FaPenToSquare, FaTriangleExclamation } from 'react-icons/fa6';

export function AssinaturaStatus(props: { className?: string }) {
  const { isLoading, data: assinatura, error, mutate } = useAssinatura();
  const { data: plano } = usePlano(assinatura?.plano);

  const toast = useToast({ colorScheme: 'primary', isClosable: true });

  const [showConfirm, setShowConfirm] = useState(false);

  const requestErrorMessage = useMemo<string | undefined>(
    () =>
      error && error.response?.status !== 404
        ? (error.response?.data as any).message || error.message
        : undefined,
    [error],
  );

  const semAssinatura = useMemo(
    () => (error ? error.response?.status === 404 : !assinatura || assinatura.encerrada_em),
    [error, assinatura],
  );

  return (
    <SkeletonText noOfLines={4} spacing="2" isLoaded={!isLoading} className={props.className}>
      {requestErrorMessage && (
        <div className="flex flex-col items-center gap-2">
          <span className="flex">
            <Badge className="!flex !items-center mr-2" colorScheme="red">
              Error
            </Badge>
            {requestErrorMessage}
          </span>
        </div>
      )}
      <div className="flex flex-col items-center text-lg gap-2">
        {semAssinatura && (
          <>
            <span className="flex">Você não possui assinatura ativa</span>
            <Button variant="primary" as={Link} href="/assinar">
              <FaPenToSquare className="mr-2" />
              Assinar agora
            </Button>
          </>
        )}
        {assinatura && !assinatura.encerrada_em && (
          <div className="w-4/5 mt-[-10%] flex flex-col items-center gap-2">
            <span className="text-primary-alt text-2xl font-bold border-b-2 border-primary p-4 pb-0 mb-4">
              Dados da assinatura
            </span>
            <span className="w-full flex flex-col items-center">
              <span className="text-sm text-gray-500">Plano</span>
              <span className="text-primary font-bold">{plano?.nome}</span>
            </span>
            <span className="w-full flex flex-col items-center">
              <span className="text-sm text-gray-500">Valor</span>
              <span className="text-primary font-bold">{moeda(plano?.valor || 0)}</span>
            </span>
            <span className="w-full flex flex-col items-center">
              <span className="text-sm text-gray-500">Iniciada em</span>
              <span className="text-primary font-bold">{data(assinatura.inicio_em, true)}</span>
            </span>
            {assinatura.fim_em && !assinatura.encerrada_em && (
              <span className="w-full flex flex-col items-center">
                <span className="text-sm text-gray-500">Encerra em</span>
                <span className="text-primary font-bold">{data(assinatura.fim_em, true)}</span>
              </span>
            )}
            {assinatura.encerrada_em && (
              <span className="w-full flex flex-col items-center">
                <span className="text-sm text-gray-500">Encerrada em</span>
                <span className="text-primary font-bold">
                  {data(assinatura.encerrada_em, true)}
                </span>
              </span>
            )}
            <span className="w-full flex flex-col items-center pt-4">
              <ConfirmationDialog
                isOpen={showConfirm}
                onCancel={() => setShowConfirm(false)}
                onConfirm={() =>
                  cancelarInscricao()
                    .then(() => toast({ title: 'Assinatura cancelada com sucesso' }))
                    .then(() => mutate())
                    .catch((error) =>
                      toast({
                        status: 'error',
                        title: 'Erro ao cancelar assinatura',
                        description: error.message,
                      }),
                    )
                    .finally(() => setShowConfirm(false))
                }
                code="CANCELAR"
              >
                <div className="text-center">
                  <Highlight
                    query={['cancelar', 'imediato', 'proporcionalmente']}
                    styles={{ color: 'primary-alt', fontWeight: 'bold' }}
                  >
                    Você tem certeza que deseja cancelar sua assinatura? O cancelamento é imediato e
                    o valor pago será devolvido como crédito proporcionalmente ao tempo restante.
                  </Highlight>
                </div>
              </ConfirmationDialog>
              <span className="text-sm text-gray-500">Ações</span>
              <span className="font-bold text-md">
                <Button
                  className="flex items-center gap-1 border-red-400 border-2"
                  _hover={{ bgColor: 'red.100' }}
                  color="red.400"
                  leftIcon={<FaTriangleExclamation />}
                  size={'sm'}
                  onClick={() => setShowConfirm(true)}
                >
                  Cancelar assinatura
                </Button>
              </span>
            </span>
          </div>
        )}
      </div>
    </SkeletonText>
  );
}
