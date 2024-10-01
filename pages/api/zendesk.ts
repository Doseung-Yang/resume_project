import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("ZENDESK_SUBDOMAIN:", process.env.ZENDESK_SUBDOMAIN);
  console.log("ZENDESK_EMAIL:", process.env.ZENDESK_EMAIL);
  console.log("ZENDESK_API_TOKEN:", process.env.ZENDESK_API_TOKEN);

  const { ticketId } = req.query;
  console.log(`Received request for ticketId: ${ticketId}`); // 로그 추가

  if (req.method === "GET") {
    if (!ticketId) {
      console.error("ticketId is missing");
      return res.status(400).json({ error: "티켓 ID가 필요합니다." });
    }

    try {
      const response = await fetch(
        `https://wadiz6256.zendesk.com/api/v2/tickets/${ticketId}.json`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.ZENDESK_EMAIL}/token:${process.env.ZENDESK_API_TOKEN}`
            ).toString("base64")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error(
          `Failed to fetch from Zendesk: ${response.status} ${response.statusText}`
        );
        return res
          .status(response.status)
          .json({ error: "티켓 정보를 가져오는 데 실패했습니다." });
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching ticket:", error);
      res.status(500).json({ error: "서버에서 오류가 발생했습니다." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
