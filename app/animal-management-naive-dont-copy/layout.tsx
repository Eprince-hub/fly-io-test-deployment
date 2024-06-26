import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getValidSession } from '../../database/sessions';

type Props = {
  children: React.ReactNode;
};

export default async function AnimalsNaiveLayout(props: Props) {
  // Task: Add a middleware to set the x-pathname header

  // 1. Get the headers
  // 2. Check if the sessionToken cookie exit
  // 3. check if the sessionToken has a valid session
  // 4. If the user is not logged in, redirect to the login page with the returnTo query parameter

  const headersList = headers();

  // 1. Check if the sessionToken cookie exit
  const sessionTokenCookie = cookies().get('sessionToken');

  // 2. check if the sessionToken has a valid session
  const session =
    sessionTokenCookie && (await getValidSession(sessionTokenCookie.value));

  console.log('Check Xpath: ', headersList.get('x-pathname'));

  // 3. Either redirect or render the login form
  if (!session) redirect(`/login?returnTo=${headersList.get('x-pathname')}`);

  return <div>{props.children}</div>;
}
