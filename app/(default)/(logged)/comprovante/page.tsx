'use client';

import { sendDeposito } from '@/services/financeiro';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaFileInvoiceDollar, FaUpload } from 'react-icons/fa6';
import { z } from 'zod';

type Form = {
  valor: string;
  referencia: string;
  comprovante: FileList;
  descricao: string;
};

export default function Comprovante() {
  const router = useRouter();
  const toast = useToast();

  const [submiting, setSubmiting] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(
      z.object({
        referencia: z.string(),
        valor: z
          .string()
          .min(1, { message: 'Valor é obrigatório' })
          .regex(/^\d{1,3}(\.\d{3})*(\,\d{2})?$/, { message: 'Não está na formatação correta' })
          .refine((value) => parseFloat(value.replace(/\./g, '').replace(',', '.')) > 0, {
            message: 'Valor deve ser maior que zero',
          }),
        comprovante: z
          .instanceof(FileList)
          .refine((files) => files.length > 0, { message: 'Comprovante é obrigatório' }),
        descricao: z.string().optional(),
      }),
    ),
  });

  const onSubmit = async (data: Form) => {
    const promise = Promise.resolve(setSubmiting(true))
      .then(() =>
        sendDeposito({
          referencia: data.referencia,
          valor: parseFloat(data.valor.replace(/\./g, '').replace(',', '.')),
          comprovante: data.comprovante[0],
          descricao: data.descricao || undefined,
        }),
      )
      .then(() => router.push('/home'))
      .finally(() => setSubmiting(false));

    toast.promise(promise, {
      loading: { title: 'Enviando comprovante' },
      error: { title: 'Erro ao enviar comprovante', isClosable: true },
      success: {
        title: 'Comprovante enviado com sucesso',
        colorScheme: 'primary',
        isClosable: true,
      },
    });
  };

  return (
    <div className="h-full flex flex-col gap-6 justify-center items-center">
      <h2 className="flex items-center font-bold text-xl text-primary">
        <FaFileInvoiceDollar className="mr-2" /> Envio de Comprovante
      </h2>
      <form className="w-1/2" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex my-2 gap-2">
          <FormControl isInvalid={!!errors.referencia} isReadOnly>
            <FormLabel>Referência</FormLabel>
            <Input
              type="text"
              {...register('referencia')}
              value={`DEP${Date.now()}`}
              variant="filled"
            />
            <FormErrorMessage>{errors.referencia?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.valor}>
            <FormLabel>Valor</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none" color="gray.500">
                R$
              </InputLeftElement>
              <Input placeholder="0,00" {...register('valor')} />
            </InputGroup>
            <FormErrorMessage>{errors.valor?.message}</FormErrorMessage>
          </FormControl>
        </div>
        <FormControl isInvalid={!!errors.comprovante} className="my-2">
          <FormLabel>Comprovante</FormLabel>
          <Input {...register('comprovante')} type="file" />
          <FormErrorMessage>{errors.comprovante?.message?.toString()}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.descricao} className="my-2">
          <FormLabel>Descrição</FormLabel>
          <Textarea
            {...register('descricao')}
            placeholder="Faça seus comentários aqui"
            height={56}
          />
          <FormErrorMessage>{errors.descricao?.message}</FormErrorMessage>
        </FormControl>
        <div className="flex justify-center mt-4">
          <Button
            type="submit"
            variant="primary"
            leftIcon={<FaUpload className="text-md" />}
            isLoading={submiting}
          >
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
}
