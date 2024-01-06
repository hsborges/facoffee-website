'use client';

import { SignupForm } from '@/components/Authentication';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { doesSessionExist } from 'supertokens-web-js/recipe/session';

export default function LoginPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    doesSessionExist().then((exist) => exist && router.push('/me'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const redirectTo = useMemo(() => params.get('redirectToPath') || '/me', [params]);

  const signinUrl = useMemo(
    () =>
      params.get('redirectToPath')
        ? `/login?redirectToPath=${params.get('redirectToPath')}`
        : '/login',
    [params],
  );

  return (
    <div className="h-full flex justify-center align-center mt-[-5vh]">
      <SignupForm signinUrl={signinUrl} redirectTo={redirectTo} />
    </div>
  );
}
