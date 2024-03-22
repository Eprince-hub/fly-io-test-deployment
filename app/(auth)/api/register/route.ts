import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createSessionInsecure } from '../../../../database/sessions';
import {
  createUserInsecure,
  getUserByUsernameInsecure,
} from '../../../../database/users';
import {
  User,
  userSchema,
} from '../../../../migrations/00006-createTableUsers';
import { secureCookieOptions } from '../../../../util/cookies';
import { createCsrfSecret } from '../../../../util/csrf';

export type RegisterResponseBodyPost =
  | {
      user: User;
    }
  | {
      errors: { message: string }[];
    };

export async function POST(
  request: NextRequest,
): Promise<NextResponse<RegisterResponseBodyPost>> {
  // Task: Implement the user registration workflow

  // Coming in subsequent lecture
  // 6. Create a token
  // 7. Create the session record
  // 8. Send the new cookie in the headers

  // 1. Get the user data from the request
  const body = await request.json();

  // 2. Validate the user data with zod
  const result = userSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.issues },
      {
        status: 400,
      },
    );
  }

  // 3. Check if user already exist in the database
  const user = await getUserByUsernameInsecure(result.data.username);

  if (user) {
    return NextResponse.json(
      { errors: [{ message: 'username is already taken' }] },
      { status: 403 },
    );
  }

  // At this stage you can check if the password matches the confirm password

  // 4. Hash the plain password from the user
  const passwordHash = await bcrypt.hash(result.data.password, 12);

  // 5. Save the user information with the hashed password in the database
  const newUser = await createUserInsecure(result.data.username, passwordHash);

  if (!newUser) {
    return NextResponse.json(
      { errors: [{ message: 'Error creating the new user' }] },
      { status: 500 },
    );
  }

  // At this stage we already confirm that the user is who they say they are

  // Coming in subsequent lecture
  // 6. Create a token
  const token = crypto.randomBytes(100).toString('base64');

  // THIS IS FOR THE CRF LECTURE
  // CSRF. Create a new CSRF Secret for the session
  const csrfSecret = createCsrfSecret();

  // 7. Create the session record
  const session = await createSessionInsecure(newUser.id, token, csrfSecret);

  if (!session) {
    return NextResponse.json(
      { errors: [{ message: 'Error creating the new session' }] },
      {
        status: 401,
      },
    );
  }

  // 8. Send the new cookie in the headers

  // First implementation before moving options to the secureCookieOptions object
  // cookies().set({
  //   name: 'sessionToken',
  //   value: session.token,
  //   httpOnly: true,
  //   path: '/',
  //   secure: process.env.NODE_ENV === 'production',
  //  maxAge: 60 * 60 * 48, // Expires in 24 hours,
  //   sameSite: 'lax',
  // });

  cookies().set({
    name: 'sessionToken',
    value: session.token,
    ...secureCookieOptions,
  });

  // 9. Return the new user information without the password hash
  return NextResponse.json({
    user: newUser,
  });
}
