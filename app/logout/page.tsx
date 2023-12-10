'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'supertokens-auth-react/recipe/session';

export default function Logout() {
  const router = useRouter();
  if (typeof window !== 'undefined') signOut({}).then(() => router.push('/login'));
}
