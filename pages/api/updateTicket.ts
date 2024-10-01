// pages/api/zendesk/updateTicket.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { ticketId, amount } = req.body;

    if (!ticketId || amount === undefined) {
      return res.status(400).json({ error: "티켓 ID와 금액이 필요합니다." });
    }

    try {
      const response = await fetch(
        `https://wadiz6256.zendesk.com/api/v2/tickets/${ticketId}.json`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.ZENDESK_API_TOKEN}`, // 액세스 토큰
          },
          body: JSON.stringify({
            ticket: {
              custom_fields: [
                {
                  id: 6477667492761, // 금액 필드 ID
                  value: amount,
                },
              ],
            },
          }),
        }
      );

      const responseText = await response.text(); // 응답을 텍스트로 읽기
      console.log("Response Text:", responseText); // 응답 로그

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Failed to update ticket: ${response.status}`, errorData);
        return res
          .status(response.status)
          .json({ error: "티켓 업데이트에 실패했습니다." });
      }

      const data = JSON.parse(responseText); // JSON으로 파싱
      res.status(200).json(data);
    } catch (error) {
      console.error("Error updating ticket:", error);
      res.status(500).json({ error: "서버에서 오류가 발생했습니다." });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
