import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAnimals } from '../../../database/animals';
import { getValidSession } from '../../../database/sessions';
import { createTokenFromSecret } from '../../../util/csrf';
import AnimalsForm from './AnimalsForm';

export const metadata = {
  title: 'Animal Admin page',
  description: 'Generated by create next app',
};

export default async function AnimalsPage() {
  // This is no longer needed because we no run a secure query
  // const animals = await getAnimalsInsecure();

  // Task: Protect the dashboard page and redirect to login if the user is not logged in
  // 1. Checking if the sessionToken cookie exists
  const sessionTokenCookie = cookies().get('sessionToken');

  // 2. Check if the sessionToken cookie is still valid
  const session =
    sessionTokenCookie && (await getValidSession(sessionTokenCookie.value));

  // 3. If the sessionToken cookie is invalid or doesn't exist, redirect to login with returnTo

  if (!session) redirect('/login?returnTo=/animals/dashboard');

  // CSRF: Create a new CSRF token for the session
  const csrfToken = createTokenFromSecret(session.csrfSecret);

  // 4. If the sessionToken cookie is valid, allow access to dashboard page
  const animals = await getAnimals(session.token);
  return <AnimalsForm animals={animals} csrfToken={csrfToken} />;
}
