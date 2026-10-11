import { SignupForm } from '@/components/auth/SignupForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | Gather',
  description: 'Join Gather to discover local events and build your personalized experience.',
};

export default function SignupPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4">
      <SignupForm />
    </div>
  );
}
