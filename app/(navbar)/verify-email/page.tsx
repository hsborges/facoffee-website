'use client';

import { Center } from '@chakra-ui/react';
import { EmailVerificationPreBuiltUI } from 'supertokens-auth-react/recipe/emailverification/prebuiltui';
import { getRoutingComponent } from 'supertokens-auth-react/ui';

export default function EmailVerification() {
  return (
    <Center className="h-full mt-[-10vh]">
      {getRoutingComponent([EmailVerificationPreBuiltUI])}
    </Center>
  );
}
