import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "[X] Method not allowed.", success: false });
  }
  const { ip, linkId, agent, country, region, city, latitude, longitude } =
    req.body;

  console.log("req.body", req.body);
  try {
    await prisma.analytics?.create({
      data: {
        agent,
        ip,
        country,
        region,
        city,
        latitude,
        longitude,
        linkId,
      },
    });
  } catch (error) {
    console.error("[X] Analytics error:", error);
  }

  return res.status(200).json({ success: true });
}
