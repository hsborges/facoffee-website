'use client';

import Logo from '@/components/Logo';
import { Button, FormControl, FormErrorMessage, FormLabel, Input, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { HTMLAttributes, useCallback, useState } from 'react';

import { PasswordInput } from './PasswordInput';

type FormInfo = {
  email?: string;
  password?: string;
  confirm_password?: string;
  first_name?: string;
  last_name?: string;
};

function Form({
  className,
  type,
  ...props
}: { type: 'signin' | 'signup' } & HTMLAttributes<HTMLElement>) {
  const [data, setData] = useState<FormInfo>({});
  const [errors, setErrors] = useState<Partial<Record<keyof FormInfo, string>>>();

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((v) => ({ ...v, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: undefined }));
  };

  const validateForm = useCallback(() => {
    let _errors: Partial<Record<keyof FormInfo, string>> = {};

    for (const key of ['email', 'password', 'confirm_password', 'first_name', 'last_name']) {
      if (!data[key as keyof FormInfo]) _errors[key as keyof FormInfo] = 'Campo obrigatório';
    }

    if (!data.password || data.password.length < 8)
      _errors.confirm_password = _errors.password = 'Senha deve ter no mínimo 8 caracteres';
    if (data.confirm_password !== data.password)
      _errors.confirm_password = 'As senhas não conferem';

    setErrors(_errors);
  }, [data]);

  return (
    <form {...props} className={'flex justify-center flex-col w-1/3 ' + className}>
      <Logo horizontal size="lg" className="mb-5" />
      {type === 'signup' && (
        <div className="flex gap-5 my-3">
          <FormControl isRequired isInvalid={!!errors?.first_name}>
            <FormLabel>Nome</FormLabel>
            <Input
              type="text"
              name="first_name"
              value={data.first_name}
              onChange={handleValueChange}
            />
            <FormErrorMessage>{errors?.first_name}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={!!errors?.last_name}>
            <FormLabel>Sobernome</FormLabel>
            <Input
              type="text"
              name="last_name"
              value={data.last_name}
              onChange={handleValueChange}
            />
            <FormErrorMessage>{errors?.last_name}</FormErrorMessage>
          </FormControl>
        </div>
      )}
      <FormControl isRequired isInvalid={errors?.email !== undefined} className="my-3">
        <FormLabel>Email</FormLabel>
        <Input type="email" name="email" value={data.email} onChange={handleValueChange} />
        <FormErrorMessage>{errors?.email}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors?.password !== undefined} isRequired className="my-3">
        <FormLabel>Senha</FormLabel>
        <PasswordInput value={data.password} name="password" onChange={handleValueChange} />
        <FormErrorMessage>{errors?.password}</FormErrorMessage>
      </FormControl>
      {type === 'signup' && (
        <FormControl isRequired isInvalid={!!errors?.confirm_password} className="my-3">
          <FormLabel>Confirmar Senha</FormLabel>
          <PasswordInput
            value={data.confirm_password}
            name="confirm_password"
            onChange={handleValueChange}
          />
          <FormErrorMessage>{errors?.confirm_password}</FormErrorMessage>
        </FormControl>
      )}
      <Button
        type="submit"
        className="my-5"
        bg={'primary'}
        onClick={(event) => {
          event.preventDefault();
          validateForm();
        }}
      >
        {type === 'signin' ? 'Entrar' : 'Registrar'}
      </Button>
      <Text className="text-sm mt-3 text-center">
        {type === 'signin' ? 'Ainda não é cadastrado?' : 'Possui uma conta?'}{' '}
        <Link
          href={type === 'signin' ? '/cadastro' : '/login'}
          className="text-primary-alt font-bold"
        >
          {type === 'signin' ? 'Cadastre-se' : 'Entre'}
        </Link>
      </Text>
    </form>
  );
}

export function SigninForm(props: HTMLAttributes<HTMLElement>) {
  return <Form {...props} type="signin" />;
}

export function SignupForm(props: HTMLAttributes<HTMLElement>) {
  return <Form {...props} type="signup" />;
}
