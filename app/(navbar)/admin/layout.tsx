'use client';

import { redirect } from 'next/navigation';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';

export default function Layout({ children }: { children: React.ReactNode }) {
  const context = useSessionContext();

  if (context.loading) return <></>;
  else if (!context.accessTokenPayload.roles.includes('admin')) return redirect('/me');
  else return <>{children}</>;
}
