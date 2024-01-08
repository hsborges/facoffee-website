'use client';

import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { FaEnvelopeCircleCheck } from 'react-icons/fa6';
import {
  getEmailVerificationTokenFromURL,
  sendVerificationEmail,
  verifyEmail,
} from 'supertokens-auth-react/recipe/emailverification';

export default function EmailVerification() {
  const router = useRouter();

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (getEmailVerificationTokenFromURL()) {
      Promise.resolve(setSent(true))
        .then(() => verifyEmail({}))
        .then(async (res) => res.status === 'OK' && router.push('/home'))
        .finally(() => setSent(false));
    }
  }, [router]);

  const Icon = useMemo(() => (sent ? FaEnvelopeCircleCheck : FaEnvelope), [sent]);

  return (
    <div className="flex flex-col gap-12 text-lg w-1/2 m-auto mt-[10%]">
      <span className="text-4xl font-bold text-primary text-center">Verificação de email</span>
      <span className="text-center">
        Olá, precisamos que você verifique seu email para continuar usando o site. Enviamos um email
        para você, por favor verifique sua caixa de entrada. Se o email não estiver lá, você pode
        solicitar outro clicando no botão abaixo.
      </span>
      <span className="text-center">
        <Button
          colorScheme="primary"
          leftIcon={<Icon className="text-xl" />}
          isLoading={sending}
          isDisabled={sent}
          onClick={() =>
            sendVerificationEmail()
              .then(() => setSent(true))
              .finally(() => setSending(false))
          }
        >
          {sent ? 'Email enviado' : 'Enviar email'}
        </Button>
      </span>
    </div>
  );
}
