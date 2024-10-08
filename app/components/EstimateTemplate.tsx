import jsPDF from "jspdf"; // PDF 생성
import { useEffect, useState } from "react";

interface EstimateTemplateProps {
  ticketId: string; // Zendesk 티켓 ID
}

const EstimateTemplate = ({ ticketId }: EstimateTemplateProps) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [userInputAmount, setUserInputAmount] = useState<number | "">("");

  useEffect(() => {
    const fetchAmount = async () => {
      try {
        // API 라우트로 HTTP 요청을 보냅니다.
        const response = await fetch(`/api/zendesk?ticketId=${ticketId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch ticket amount");
        }
        const data = await response.json();
        setAmount(data.amount); // 가져온 금액을 상태에 저장
      } catch (error) {
        console.error("Error fetching ticket amount:", error);
      }
    };

    fetchAmount();
  }, [ticketId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInputAmount(Number(e.target.value));
  };

  const calculatePercentages = (inputAmount: number) => {
    const percentages = {
      tenPercent: inputAmount * 0.2,
      twentyPercent: inputAmount * 0.4,
      fortyPercent: inputAmount * 0.4,
    };
    return percentages;
  };

  const handleDownloadPDF = () => {
    const totalAmount = userInputAmount ? Number(userInputAmount) : 0;
    const { tenPercent, twentyPercent, fortyPercent } =
      calculatePercentages(totalAmount);

    // PDF 생성 로직 (예시)
    const doc = new jsPDF();
    doc.text(`Total Amount: ${totalAmount}`, 10, 10);
    doc.text(`10% Amount: ${tenPercent}`, 10, 20);
    doc.text(`20% Amount: ${twentyPercent}`, 10, 30);
    doc.text(`40% Amount: ${fortyPercent}`, 10, 40);
    doc.save("estimate.pdf");
  };

  return (
    <div>
      <h2>Estimate Template</h2>
      <label>Amount from Ticket: {amount ? amount : "Loading..."}</label>
      <br />
      <label>
        Enter Amount:
        <input
          type="number"
          value={userInputAmount}
          onChange={handleInputChange}
          placeholder="Enter your amount"
        />
      </label>
      <br />
      <button onClick={handleDownloadPDF}>Download PDF</button>
    </div>
  );
};

export default EstimateTemplate;
