import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  console.log(req.nextUrl.pathname);
  // Get pathname:
  const slug = req.nextUrl.pathname.split("/").pop();

  // Get data from query:
  const data = await fetch(`${req.nextUrl.origin}/api/url/${slug}`);

  // Return (/) if not found (404):
  if (data.status === 404) {
    return NextResponse.redirect(req.nextUrl.origin);
  }

  // Convert data to JSON:
  const dataToJson = await data.json();

  await fetch(`${req.nextUrl.origin}/api/analytics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ip: req.ip,
      linkId: dataToJson.id,
      agent: req.headers.get("user-agent"),
      country: req.geo?.country,
      region: req.geo?.region,
      city: req.geo?.city,
      latitude: req.geo?.latitude,
      longitude: req.geo?.longitude,
    }),
  });

  if (data?.url) {
    return NextResponse.redirect(new URL(dataToJson.url));
  }
}

export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|dashboard|tree|auth|img|fonts|manifest.json).*)",
};
