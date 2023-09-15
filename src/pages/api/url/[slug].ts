import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({
      error:
        "[X] Error: Missing slug? Remember that urls start like this: /u/yourLink",
    });
  }

  const data = await prisma.link.findFirst({
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  if (!data) {
    return res.status(404).json({
      error:
        "[X] Error: Link not found or removed. Go to slug.vercel.app and create a new link.",
    });
  }

  try {
    let ip = req.headers["x-real-ip"] as string;

    const forwardedFor = req.headers["x-forwarded-for"] as string;
    if (!ip && forwardedFor) {
      ip = forwardedFor?.split(",").at(0) ?? "Unknown";
    }
    let ipMedatadata;
    if (ip !== "Unknown") {
      const fetchedIpMetadaResult = await fetch(
        `https://ipapi.co/${ip}/json/`
      ).then((res) => res.json());
      if (!fetchedIpMetadaResult.error) {
        ipMedatadata = fetchedIpMetadaResult;
      }
    }

    console.log("🔍 IP:", ip);
    console.log("💿 IP Metadata:", ipMedatadata);
    const analytic = await prisma.analytics?.create({
      data: {
        agent: req.headers["user-agent"],
        ip,
        city: ipMedatadata?.city,
        continent: ipMedatadata?.continent_code,
        country: ipMedatadata?.country_name,
        region: ipMedatadata?.region,
        linkId: data.id,
      },
    });
    console.log("analytic", analytic);
    console.log("✅ Analytics created.");
  } catch (error) {
    console.error("[X] Error creating analytics:", error);
  }

  // Cache:
  res.setHeader("Cache-Control", "s-maxage=1000000, stale-while-revalidate");

  return res.json(data);
}
