'use client';

import { SessionAuth } from 'supertokens-auth-react/recipe/session';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionAuth requireAuth doRedirection>
      {children}
    </SessionAuth>
  );
}
