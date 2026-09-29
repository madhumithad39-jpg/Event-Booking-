import { createAuthClient } from 'better-auth/react';
import { emailOTPClient } from 'better-auth/client/plugins';

const authServerUrl = import.meta.env.VITE_BETTER_AUTH_URL || 'http://localhost:5000';

export const authClient = createAuthClient({
  baseURL: authServerUrl,
  plugins: [emailOTPClient()],
});

export const { useSession, signIn, signOut, signUp } = authClient;

export default authClient;
