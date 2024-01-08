'use client';

import { Credito, Debito, useExtrato, useSaldo } from '@/services/financeiro';
import { data as formatData, moeda } from '@/util/formatter';
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SkeletonText,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import classNames from 'classnames';
import { capitalize } from 'lodash';
import Link from 'next/link';
import { useState } from 'react';
import { MdOutlineFileUpload } from 'react-icons/md';

const StatusColors: Record<Credito['status'], string> = {
  pendente: 'text-gray-500',
  aprovado: 'text-green-500',
  rejeitado: 'text-gray-500 line-through',
};

const corSaldo = (saldo: number) => {
  if (saldo < 0) return 'text-red-500';
  if (saldo > 0) return 'text-green-500';
  return undefined;
};

export function DetalhesOperacao(props: { operacao: Credito | Debito; onClose: () => void }) {
  const data: Record<string, string> = {
    Identificador: props.operacao.id,
    Referência: props.operacao.referencia,
    Tipo: props.operacao.tipo,
    Valor: moeda(props.operacao.valor),
    'Data de emissão': formatData(props.operacao.data_emissao, true),
    Descrição: props.operacao.descricao,
  };

  if (props.operacao.tipo === 'Credito') {
    Object.assign(data, {
      Status: `${capitalize(props.operacao.status)}`,
      'Revisado em': props.operacao.revisado_em && formatData(props.operacao.revisado_em, true),
    });
  }

  return (
    <Modal isOpen onClose={props.onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-center my-2">{props.operacao.referencia}</ModalHeader>
        <ModalCloseButton />
        <ModalBody className="mt-4 mb-8">
          <div className="flex flex-col gap-4">
            {Object.entries(data)
              .filter(([_, value]) => value)
              .map(([key, value]) => (
                <div key={key}>
                  <span className="block text-gray-500 text-sm">{key}</span>
                  <span>{value}</span>
                </div>
              ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export function Extrato(props: { className?: string }) {
  const { isLoading, data } = useExtrato();
  const { data: saldo } = useSaldo();

  const [operacao, setOperacao] = useState<Credito | Debito>();

  return (
    <SkeletonText
      noOfLines={3}
      spacing="2"
      isLoaded={!isLoading}
      className={classNames('flex justify-center', props.className)}
    >
      {data && (
        <TableContainer className="w-[575px]">
          <Table colorScheme="primary" variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th className="w-0">Data</Th>
                <Th className="w-0">Tipo</Th>
                <Th className="w-full">Referência</Th>
                <Th className="w-0">Valor</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.length === 0 ? (
                <Tr>
                  <Td colSpan={4} className="!text-center">
                    Nenhuma atividade foi encontrada
                  </Td>
                </Tr>
              ) : (
                <>
                  {operacao && (
                    <DetalhesOperacao operacao={operacao} onClose={() => setOperacao(undefined)} />
                  )}
                  {data.map((item) => {
                    return (
                      <Tr
                        key={item.id}
                        onClick={() => setOperacao(item)}
                        className="hover:cursor-pointer hover:bg-primary-50"
                      >
                        <Td>{formatData(item.data_emissao)}</Td>
                        <Td>
                          <span
                            className={item.tipo === 'Credito' ? 'text-green-400' : 'text-red-400'}
                          >
                            {item.tipo}
                          </span>
                        </Td>
                        <Td>
                          <span className="flex flex-col gap-0">
                            <span className="text-sm">{item.referencia}</span>
                          </span>
                        </Td>
                        <Td>
                          <div>
                            <div
                              className={item.tipo === 'Credito' ? StatusColors[item.status] : ''}
                            >
                              {moeda(item.valor)}
                            </div>
                          </div>
                        </Td>
                      </Tr>
                    );
                  })}
                </>
              )}
            </Tbody>
            <Tfoot>
              {saldo && (
                <>
                  <Tr>
                    <Th colSpan={3}>Saldo</Th>
                    <Th>
                      <span className={corSaldo(saldo.saldo)}>{moeda(saldo.saldo)}</span>
                    </Th>
                  </Tr>
                  <Tr>
                    <Th colSpan={3}>Pendente</Th>
                    <Th>
                      <span>{moeda(saldo.pendente)}</span>
                    </Th>
                  </Tr>
                </>
              )}
            </Tfoot>
          </Table>
          <Box className="flex justify-center mt-4">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<MdOutlineFileUpload className="text-xl" />}
              as={Link}
              href="/comprovante"
            >
              Enviar comprovante
            </Button>
          </Box>
        </TableContainer>
      )}
    </SkeletonText>
  );
}
