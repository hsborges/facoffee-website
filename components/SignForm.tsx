'use client';

import Logo from '@/components/Logo';
import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { signIn, signUp } from 'supertokens-auth-react/recipe/emailpassword';

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

const defaultFormInfo: FormInfo = {
  email: '',
  password: '',
  confirm_password: '',
  first_name: '',
  last_name: '',
};

function Form(props: FormProps) {
  const router = useRouter();

  const [data, setData] = useState<FormInfo>(defaultFormInfo);
  const [success, setSuccess] = useState<string>();
  const [error, setError] = useState<string>();
  const [errors, setErrors] = useState<Partial<Record<keyof FormInfo, string>>>();

  useEffect(() => {
    setData(defaultFormInfo);
    setErrors({});
    setError(undefined);
    const timer = success && setTimeout(() => setSuccess(undefined), 5000);
    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    const timer = error && setTimeout(() => setError(undefined), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((v) => ({ ...v, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: undefined }));
  };

  const validateForm = useCallback(
    (
      fields: Array<keyof FormInfo> = [
        'email',
        'password',
        'confirm_password',
        'first_name',
        'last_name',
      ],
    ) => {
      let _errors: Partial<Record<keyof FormInfo, string>> = {};

      for (const key of fields) {
        if (!data[key as keyof FormInfo]) _errors[key as keyof FormInfo] = 'Campo obrigatório';

        if (key === 'password') {
          if (!data.password || data.password.length < 8)
            _errors.confirm_password = _errors.password = 'Senha deve ter no mínimo 8 caracteres';
        }

        if (key === 'confirm_password') {
          if (data.confirm_password !== data.password)
            _errors.confirm_password = 'As senhas não conferem';
        }
      }

      return _errors;
    },
    [data],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (props.type === 'signin') {
        const _errors = validateForm(['email', 'password']);
        if (Object.keys(_errors).length) return setErrors((err) => ({ ...err, ..._errors }));

        const response = await signIn({
          formFields: [
            { id: 'email', value: data.email as string },
            { id: 'password', value: data.password as string },
          ],
        });

        if (response.status === 'FIELD_ERROR') {
          setErrors((err) =>
            response.formFields.reduce(
              (memo, field) => ({ ...memo, [field.id]: field.error }),
              err,
            ),
          );
        } else if (response.status === 'SIGN_IN_NOT_ALLOWED') {
          setError('Login não permitido');
        } else if (response.status === 'WRONG_CREDENTIALS_ERROR') {
          setError('Email ou senha incorretos');
        } else {
          router.push(props.redirectTo);
        }
      }

      if (props.type === 'signup') {
        const _errors = validateForm();
        if (Object.keys(_errors).length) return setErrors((err) => ({ ...err, ..._errors }));

        const response = await signUp({
          formFields: [
            { id: 'email', value: data.email as string },
            { id: 'password', value: data.password as string },
            { id: 'first_name', value: data.first_name as string },
            { id: 'last_name', value: data.last_name as string },
          ],
        });

        if (response.status === 'FIELD_ERROR') {
          setErrors((err) =>
            response.formFields.reduce(
              (memo, field) => ({ ...memo, [field.id]: field.error }),
              err,
            ),
          );
        } else if (response.status === 'SIGN_UP_NOT_ALLOWED') {
          setError('Cadastro não permitido');
        } else {
          setSuccess('Cadastro realizado com sucesso!');
        }
      }
    },
    [props.type, data, validateForm, router, props.redirectTo],
  );

  const url = props.type === 'signin' ? props.signupUrl : props.signinUrl;

  return (
    <form
      className={
        'flex justify-center px-4 flex-col w-full sm:min-w-[400px] md:w-1/3  ' + props.className
      }
      onSubmit={handleSubmit}
    >
      <Logo horizontal size="lg" className="mb-5" />
      {error && (
        <Alert status="error" variant={'left-accent'} className="my-3">
          <AlertIcon />
          {error}
        </Alert>
      )}
      {success && (
        <Alert status="success" variant={'left-accent'} className="my-3">
          <AlertIcon />
          {success}
        </Alert>
      )}
      {props.type === 'signup' && (
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
      {props.type === 'signup' && (
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
        className="my-5 hover:bg-primary-alt"
        bg={'primary'}
        _hover={{ color: 'white' }}
      >
        {props.type === 'signin' ? 'Entrar' : 'Registrar'}
      </Button>
      {url && (
        <Text className="text-sm mt-3 text-center">
          {props.type === 'signin' ? 'Ainda não é cadastrado?' : 'Possui uma conta?'}{' '}
          <Link href={url} className="text-primary-alt font-bold">
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
