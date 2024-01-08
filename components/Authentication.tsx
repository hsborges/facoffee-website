'use client';

import Logo from '@/components/Logo';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn, signUp } from 'supertokens-auth-react/recipe/emailpassword';
import { z } from 'zod';

import { PasswordInput } from './PasswordInput';

type FormInfo = {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
};

type FormProps = {
  className?: string;
  type: 'signin' | 'signup';
  redirectTo: string;
  signinUrl?: string;
  signupUrl?: string;
};

function Form(props: FormProps) {
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  let schema = z
    .object({
      email: z.string().email({ message: 'Email inválido' }),
      password: z.string().min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
    })
    .and(
      z.object(
        props.type === 'signup'
          ? {
              confirm_password: z
                .string()
                .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
              first_name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
              last_name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
            }
          : {},
      ),
    )
    .refine((data) => props.type === 'signin' || data.password === data.confirm_password, {
      message: 'Senhas não conferem',
      path: ['confirm_password'],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormInfo>({
    resolver: zodResolver(schema),
  });

  const submitForm = async (data: FormInfo) => {
    let promise: Promise<void> = Promise.resolve(setLoading(true));

    if (props.type === 'signin') {
      promise = promise.then(() =>
        signIn({
          formFields: [
            { id: 'email', value: data.email as string },
            { id: 'password', value: data.password as string },
          ],
        }).then((response) => {
          if (response.status === 'OK') return router.push(props.redirectTo);

          if (response.status === 'FIELD_ERROR') {
            response.formFields.forEach((field) =>
              setError(field.id as keyof FormInfo, { message: field.error, type: 'validate' }),
            );
          } else if (response.status === 'SIGN_IN_NOT_ALLOWED') {
            setError('email', { message: 'Login não permitido', type: 'validate' });
          } else if (response.status === 'WRONG_CREDENTIALS_ERROR') {
            setError('email', { message: 'Email ou senha incorretos', type: 'validate' });
            setError('password', { message: 'Email ou senha incorretos', type: 'validate' });
          }
        }),
      );
    }

    if (props.type === 'signup') {
      promise = promise.then(() =>
        signUp({
          formFields: [
            { id: 'email', value: data.email as string },
            { id: 'password', value: data.password as string },
            { id: 'first_name', value: data.first_name as string },
            { id: 'last_name', value: data.last_name as string },
          ],
        }).then((response) => {
          if (response.status === 'OK') return router.push(props.redirectTo);

          if (response.status === 'FIELD_ERROR') {
            response.formFields.forEach((field) =>
              setError(field.id as keyof FormInfo, { message: field.error, type: 'validate' }),
            );
          } else if (response.status === 'SIGN_UP_NOT_ALLOWED') {
            setError('email', { message: 'Cadastro não permitido', type: 'validate' });
          }
        }),
      );
    }

    await promise
      .catch((error) => toast({ title: error.message, status: 'error', position: 'top' }))
      .finally(() => setLoading(false));
  };

  const url = useMemo(() => (props.type === 'signin' ? props.signupUrl : props.signinUrl), [props]);

  return (
    <form
      className={classNames(
        'flex justify-center px-4 flex-col w-full sm:min-w-[400px] md:w-1/3',
        props.className,
      )}
      onSubmit={handleSubmit(submitForm)}
    >
      <Logo horizontal size="lg" className="mb-5" link="/" />
      {props.type === 'signup' && (
        <div className="flex gap-5 my-3">
          <FormControl isRequired isInvalid={!!errors.first_name}>
            <FormLabel>Nome</FormLabel>
            <Input type="text" {...register('first_name')} data-testid="form-first_name" />
            <FormErrorMessage data-testid="form-first_name-error">
              {errors.first_name?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.last_name}>
            <FormLabel>Sobernome</FormLabel>
            <Input type="text" {...register('last_name')} data-testid="form-last_name" />
            <FormErrorMessage data-testid="form-last_name-error">
              {errors.last_name?.message}
            </FormErrorMessage>
          </FormControl>
        </div>
      )}
      <FormControl isRequired isInvalid={!!errors.email} className="my-3">
        <FormLabel>Email</FormLabel>
        <Input type="email" {...register('email')} data-testid="form-email" />
        <FormErrorMessage data-testid="form-email-error">{errors.email?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.password} isRequired className="my-3">
        <FormLabel>Senha</FormLabel>
        <PasswordInput {...register('password')} data-testid="form-password" />
        <FormErrorMessage data-testid="form-password-error">
          {errors.password?.message}
        </FormErrorMessage>
      </FormControl>
      {props.type === 'signup' && (
        <FormControl isRequired isInvalid={!!errors.confirm_password} className="my-3">
          <FormLabel>Confirmar Senha</FormLabel>
          <PasswordInput {...register('confirm_password')} data-testid="form-confirm_password" />
          <FormErrorMessage data-testid="form-confirm_password-error">
            {errors.confirm_password?.message}
          </FormErrorMessage>
        </FormControl>
      )}
      <Button
        type="submit"
        colorScheme="primary-alt"
        className="my-5 hover:bg-primary-alt"
        isLoading={loading}
        data-testid="form-submit"
      >
        {props.type === 'signin' ? 'Entrar' : 'Registrar'}
      </Button>
      {url && (
        <Text className="text-sm mt-3 text-center">
          {props.type === 'signin' ? 'Ainda não é cadastrado?' : 'Possui uma conta?'}{' '}
          <Link href={url} className="text-primary-alt font-bold" data-testid="form-link">
            {props.type === 'signin' ? 'Cadastre-se' : 'Entre'}
          </Link>
        </Text>
      )}
    </form>
  );
}

export function SigninForm(props: Omit<FormProps, 'type' | 'signinUrl'>) {
  return <Form {...props} type="signin" />;
}

export function SignupForm(props: Omit<FormProps, 'type' | 'signupUrl'>) {
  return <Form {...props} type="signup" />;
}
