'use client';

import { SignupForm } from '@/app/components/SignForm';

export default function LoginPage() {
  return (
    <div className="h-full flex justify-center align-center mt-[-5vh]">
      <SignupForm signinUrl="/login" redirectTo="/me" />
    </div>
  );
}
