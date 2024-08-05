import { getProject } from '../lib/projects'
import { defineMiddlewareRouter } from './router'
import { lucia } from '../lib/auth'
import { verifyRequestOrigin } from 'lucia'

export const onRequest = defineMiddlewareRouter({
	'**': async ({ locals, request, cookies }, next) => {
    if (!request.headers.get('accept')) return next()
    if (request.method !== "GET") {
      const originHeader = request.headers.get("Origin");
      const hostHeader = request.headers.get("Host");
      if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
        return new Response(null, {
          status: 403
        });
      }
    }

    const sessionId = cookies.get(lucia.sessionCookieName)?.value ?? null;
  	if (!sessionId) {
  		locals.user = null;
  		locals.session = null;
  		return next();
  	}

    const { session, user } = await lucia.validateSession(sessionId);
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    locals.session = session;
    locals.user = user;

		return next()
	},
	'/app/**': async (ctx, next) => {
		const { request, locals } = ctx
    if (!request.headers.get('accept')) return next()
		locals.project = await getProject('', ctx)
		return next()
	},
})
