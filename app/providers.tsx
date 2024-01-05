'use client';

import { ChakraProvider, defineStyleConfig, withDefaultColorScheme } from '@chakra-ui/react';
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
      EmailPassword.init({
        async getRedirectionURL(context) {
          if (context.action !== 'SUCCESS') return '/login';
          else context.redirectToPath;
        },
      }),
      EmailVerification.init({ mode: 'REQUIRED' }),
      Session.init(),
    ],
    async getRedirectionURL(context) {
      if (context.action === 'TO_AUTH') return '/login';
      if (context.showSignIn) return '/registrar';
    },
  });
}

export const theme = extendTheme({
  fonts: {
    heading: 'var(--font-rubik)',
    body: 'var(--font-rubik)',
  },
  colors: {
    primary: {
      default: '#D7B595',
      '50': '#F8F2EC',
      '100': '#EBDBCB',
      '200': '#DFC4AA',
      '300': '#D2AC89',
      '400': '#C69567',
      '500': '#D7B595',
      '600': '#946538',
      '700': '#6F4B2A',
      '800': '#4A321C',
      '900': '#25190E',
    },
    'primary-alt': {
      default: '#3E372C',
      '50': '#F4F3F0',
      '100': '#E1DDD5',
      '200': '#CEC7BA',
      '300': '#BBB0A0',
      '400': '#A89A85',
      '500': '#95846A',
      '600': '#776A55',
      '700': '#594F40',
      '800': '#3C352A',
      '900': '#1E1A15',
    },
  },
  semanticTokens: {
    colors: {
      primary: 'primary.default',
      'primary-alt': 'primary-alt.default',
    },
  },
  components: {
    Button: defineStyleConfig({
      variants: {
        primary: {
          bgColor: 'primary',
          color: 'primary-alt',
          _hover: { bgColor: 'primary-alt', color: 'primary' },
        },
      },
    }),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SuperTokensWrapper>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </SuperTokensWrapper>
  );
}
