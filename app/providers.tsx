'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import SuperTokens, { SuperTokensWrapper } from 'supertokens-auth-react';
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword';
import EmailVerification from 'supertokens-auth-react/recipe/emailverification';
import Session from 'supertokens-auth-react/recipe/session';

if (typeof window !== 'undefined') {
  SuperTokens.init({
    appInfo: {
      appName: 'FACOFFEE',
      apiDomain: process.env.NEXT_PUBLIC_BASE_URL,
      apiBasePath: process.env.NEXT_PUBLIC_BASE_URL_PATH,
      websiteDomain: process.env.NEXT_PUBLIC_WEBSITE_URL,
      websiteBasePath: process.env.NEXT_PUBLIC_WEBSITE_URL_PATH,
    },
    recipeList: [
      EmailPassword.init(),
      EmailVerification.init({ mode: 'REQUIRED' }),
      Session.init(),
    ],
  });
}

export const theme = extendTheme({
  fonts: {
    heading: 'var(--font-rubik)',
    body: 'var(--font-rubik)',
  },
  colors: {
    primary: '#D7B595',
    'primary-alt': '#3E372C',
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SuperTokensWrapper>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </SuperTokensWrapper>
  );
}
