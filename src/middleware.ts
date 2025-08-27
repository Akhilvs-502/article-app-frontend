// middleware function  And Confiq 
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {


  const token = req.cookies.get("refreshToken")
  // const token = req.cookies.get("refreshToken")
  const accessToken = req.cookies.get("accessToken")
  const url = req.nextUrl.pathname
  console.log(token, "middleware");
  console.log(url, "middleware url");
  


  const publicPath = ["/", "/auth/login",]

  if (url.startsWith("/auth/login") && token) {

    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (publicPath.includes(url)) {

    return NextResponse.next();

  }






}
//Configure where the middleware should run
export const config = {
  matcher: [
    "/auth/login", "/Profile", "/admin/:path*",
    "/problems", "/Arena", "/admin"    // exact path
  ],
};

