import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createSessionInsecure } from '../../../../database/sessions';
import { getUserWithPasswordHashByUsernameInsecure } from '../../../../database/users';
import {
  User,
  userSchema,
} from '../../../../migrations/00006-createTableUsers';
import { secureCookieOptions } from '../../../../util/cookies';
import { createCsrfSecret } from '../../../../util/csrf';

export type LoginResponseBodyPost =
  | {
      user: Pick<User, 'username'>;
    }
  | {
      errors: { message: string }[];
    };

export async function POST(
  request: NextRequest,
): Promise<NextResponse<LoginResponseBodyPost>> {
  // Task: Implement the user login workflow

  // Coming in subsequent lecture
  // 5. Create a token
  // 6. Create the session record
  // 7. Send the new cookie in the headers

  // 1. Get the user data from the request
  const body = await request.json();

  // 2. Validate the user data
  const result = userSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.issues },
      {
        status: 400,
      },
    );
  }

  // 3. verify the user credentials
  const userWithPasswordHash = await getUserWithPasswordHashByUsernameInsecure(
    result.data.username,
  );

  if (!userWithPasswordHash) {
    return NextResponse.json(
      { errors: [{ message: 'username or password not valid' }] },
      { status: 403 },
    );
  }

  // 4. Validate the user password by comparing with hashed password
  const isPasswordValid = await bcrypt.compare(
    result.data.password,
    userWithPasswordHash.passwordHash,
  );

  if (!isPasswordValid) {
    return NextResponse.json(
      { errors: [{ message: 'username or password not valid' }] },
      {
        status: 401,
      },
    );
  }

  // At this stage we already confirm that the user is who they say they are
  // const {randomBytes} = require('node:crypto')

  //  Coming in subsequent lecture
  // 5. Create a token
  const token = crypto.randomBytes(100).toString('base64');

  // THIS IS FOR THE CRF LECTURE
  // CSRF. Create a new CSRF Secret for the session
  const csrfSecret = createCsrfSecret();

  // 6. Create the session record
  const session = await createSessionInsecure(
    userWithPasswordHash.id,
    token,
    csrfSecret,
  );

  if (!session) {
    return NextResponse.json(
      { errors: [{ message: 'Error creating the new session' }] },
      {
        status: 401,
      },
    );
  }

  // 7. Send the new cookie in the headers
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

  // 8. Return the new user information without the password hash
  return NextResponse.json({
    user: {
      username: userWithPasswordHash.username,
    },
  });
}
