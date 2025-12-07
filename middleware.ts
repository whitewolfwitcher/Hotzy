import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // No authentication required - allow all requests
  return NextResponse.next();
}

export const config = {
  matcher: [],
};