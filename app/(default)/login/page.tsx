'use client';

import { SigninForm } from '@/app/components/SignForm';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';

export default function LoginPage() {
  const router = useRouter();
  const context = useSessionContext();

  useEffect(() => {
    if (context.loading) return;
    if (context.doesSessionExist) router.push('/me');
  }, [context, router]);

  return context.loading ? (
    <></>
  ) : (
    <div className="h-full flex justify-center align-center mt-[-5vh]">
      <SigninForm signupUrl="/registrar" redirectTo="/me" />
    </div>
  );
}
