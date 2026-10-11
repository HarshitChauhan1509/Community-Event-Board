import { LoginForm } from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log In | Gather',
  description: 'Sign in to access your curated event feed and custom reminders.',
};

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4">
      <LoginForm />
    </div>
  );
}
