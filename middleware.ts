import { NextRequest, NextResponse } from 'next/server';

export const config = {
  //  The matcher config can also take an array of path
  matcher: '/animal-management-naive-dont-copy/:path*',
};

export function middleware(request: NextRequest) {
  console.log('Checking: ', request.nextUrl.pathname);
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  console.log('Headers: ', requestHeaders);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
