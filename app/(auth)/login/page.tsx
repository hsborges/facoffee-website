'use client';

import { SigninForm } from '@/components/Authentication';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { doesSessionExist } from 'supertokens-auth-react/recipe/session';

export default function LoginPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    doesSessionExist().then((exist) => exist && router.push('/home'));
  }, [router]);

  const redirectTo = useMemo(() => params.get('redirectToPath') || '/home', [params]);

  return (
    <div className="h-full flex justify-center align-center mt-[-5vh]">
      <SigninForm signupUrl={`/registrar?redirectToPath=${redirectTo}`} redirectTo={redirectTo} />
    </div>
  );
}
