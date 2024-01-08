'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signOut } from 'supertokens-auth-react/recipe/session';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    signOut({}).then(() => router.push('/'));
  }, [router]);
}
