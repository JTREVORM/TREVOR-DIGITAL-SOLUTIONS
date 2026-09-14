import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from '@/lib/supabase/config'

export async function proxy(request: NextRequest) {
  // This runs on every request, so it must not be the thing that takes the
  // site down. Without Supabase credentials the public marketing pages still
  // render perfectly well from local content, so pass them straight through
  // rather than throwing and turning every route into a 500.
  if (!isSupabaseConfigured) {
    // Without credentials there is no session to check and nothing to
    // protect: the admin has no server-side data at all. The portal renders
    // as an unauthenticated interface preview that says so on every screen,
    // so the UI can be reviewed before Phase 6 connects Supabase Auth.
    //
    // The moment the two environment variables are present, the real session
    // check below takes over and /admin/* requires a signed-in user.
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    supabaseUrl as string,
    supabaseAnonKey as string,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    request.nextUrl.pathname.startsWith('/admin') &&
    request.nextUrl.pathname !== '/admin/login'
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
