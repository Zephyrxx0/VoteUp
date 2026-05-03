import createMiddleware from 'next-intl/middleware';
import {routing} from './navigation';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /static, /favicon.ico, /robots.txt, etc. (static files)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
