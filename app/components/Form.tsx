"use client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useState } from "react";

interface CustomerDetails {
  name: string;
  contactPerson: string;
  product: string;
  estimateDate: string;
}

interface Item {
  name: string;
  unitPrice: number;
  quantity: number;
}

interface CustomField {
  id: number;
  value: number;
}

interface EstimateTemplateProps {
  amount: number;
  customerDetails: CustomerDetails;
  validityDate: string;
  items: Item[];
  toggleEdit: () => void;
  hideEditButton: boolean;
}

// 견적서 템플릿 컴포넌트
const EstimateTemplate = ({
  amount,
  customerDetails,
  validityDate,
  items,
  toggleEdit,
  hideEditButton,
}: EstimateTemplateProps) => {
  return (
    <div
      id="estimate-template"
      className="max-w-2xl mx-auto p-5 border border-gray-300 rounded-lg"
    >
      <h1 className="text-2xl font-bold text-center">견적서</h1>
      <div className="mt-4">
        <p>수 신 : {customerDetails.name}</p>
        <p>담 당 : {customerDetails.contactPerson}</p>
        <p>제 품 : {customerDetails.product}</p>
        <p>견적일자 : {customerDetails.estimateDate}</p>
        <p>유효일자 : {validityDate}</p>
      </div>
      {!hideEditButton && (
        <button
          onClick={toggleEdit}
          className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
        >
          수정
        </button>
      )}
      <table className="min-w-full mt-5 border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">견적항목</th>
            <th className="border px-4 py-2">단가</th>
            <th className="border px-4 py-2">수량</th>
            <th className="border px-4 py-2">합계</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">
                {item.unitPrice.toLocaleString()} 원
              </td>
              <td className="border px-4 py-2">{item.quantity}</td>
              <td className="border px-4 py-2">
                {(item.unitPrice * item.quantity).toLocaleString()} 원
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-5 text-gray-500">
        <p>금액합계: {amount.toLocaleString()} 원</p>
        <p>부가세: {(amount * 0.1).toLocaleString()} 원</p>
        <p>제안총액: {(amount + amount * 0.1).toLocaleString()} 원</p>
      </div>
      <div className="mt-5 text-gray-500">
        <p>비고:</p>
        <p>
          교육 및 인건비는 2인에 결정 진행되며 교육작 등 제안사항 모두 와디즈의
          비용 처리
        </p>
        <p>페이지 저작권은 후 수작업 여부도 별도 발생</p>
        <p>그 외 기타 세부사항이나 협의사항은 협의에 기재</p>
      </div>
    </div>
  );
};

// PDF 다운로드 함수
const downloadPDF = (setHideEditButton: (value: boolean) => void) => {
  setHideEditButton(true); // PDF 다운로드 중일 때 수정 버튼 숨기기
  const estimateElement = document.getElementById("estimate-template");

  if (estimateElement) {
    setTimeout(() => {
      html2canvas(estimateElement).then((canvas) => {
        const pdf = new jsPDF();
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save("estimate.pdf");
        setHideEditButton(false); // PDF 다운로드가 끝나면 수정 버튼 다시 표시
      });
    }, 10000); // 10초 동안 버튼 숨기기
  }
};

// 메인 폼 컴포넌트
const MainForm = () => {
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 관리
  const [hideEditButton, setHideEditButton] = useState(false); // PDF 다운로드 시 수정 버튼 숨기기
  const [ticketId, setTicketId] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [validityDate] = useState<string>(
    `유효일자: ${new Date(
      new Date().setDate(new Date().getDate() + 10)
    ).toLocaleDateString()}`
  );
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "상대 고객사",
    contactPerson: "상대 고객사 담당자 성명",
    product: "견적 대상 제품",
    estimateDate: new Date().toLocaleDateString(),
  });
  const [items] = useState<Item[]>([
    { name: "광고 대행 비용", unitPrice: 1000000, quantity: 1 },
    { name: "지원사업 간접비", unitPrice: 2000000, quantity: 1 },
    { name: "지원사업 직접비", unitPrice: 4000000, quantity: 1 },
  ]);
  const [inputAmount, setInputAmount] = useState<string>("");

  const toggleEdit = () => {
    setIsEditing(!isEditing); // 수정 모드 토글
  };

  const handleCustomerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const fetchAmount = async () => {
    if (!ticketId) {
      alert("티켓 번호를 입력하세요.");
      return;
    }

    try {
      const res = await fetch(`/api/zendesk?ticketId=${ticketId}`);
      if (!res.ok) throw new Error("티켓 정보를 가져오는 데 실패했습니다.");

      const data = await res.json();
      if (data.ticket && data.ticket.custom_fields) {
        const amountField = data.ticket.custom_fields.find(
          (field: CustomField) => field.id === 6477667492761
        );
        if (amountField) {
          setAmount(amountField.value);
          setInputAmount(amountField.value.toString());
        } else {
          throw new Error("금액 정보가 없습니다.");
        }
      } else {
        throw new Error("티켓 정보가 유효하지 않습니다.");
      }
    } catch (error) {
      // error가 Error 타입인지 확인
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const createEstimate = () => {
    if (inputAmount.trim() === "") {
      alert("금액을 입력하세요.");
      return;
    }
    const finalAmount = parseFloat(inputAmount);
    if (isNaN(finalAmount)) {
      alert("유효한 금액을 입력하세요.");
      return;
    }
    setAmount(finalAmount);
  };

  return (
    <div>
      <input
        type="text"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
        placeholder="티켓 번호 입력"
        className="block w-full px-3 py-2 border border-gray-300 rounded-md"
      />
      <button
        onClick={fetchAmount}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        금액 가져오기
      </button>

      {isEditing && (
        <div className="mb-4">
          <label>수 신:</label>
          <input
            type="text"
            name="name"
            value={customerDetails.name}
            onChange={handleCustomerInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <label>담 당:</label>
          <input
            type="text"
            name="contactPerson"
            value={customerDetails.contactPerson}
            onChange={handleCustomerInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <label>제 품:</label>
          <input
            type="text"
            name="product"
            value={customerDetails.product}
            onChange={handleCustomerInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <label>견적일자:</label>
          <input
            type="text"
            name="estimateDate"
            value={customerDetails.estimateDate}
            onChange={handleCustomerInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={toggleEdit}
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
          >
            저장
          </button>
        </div>
      )}

      <label
        htmlFor="input-amount"
        className="block text-sm font-medium text-gray-700 mt-4"
      >
        금액 입력
      </label>
      <input
        type="text"
        id="input-amount"
        value={inputAmount}
        onChange={(e) => setInputAmount(e.target.value)}
        placeholder="금액 입력"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
      />

      <button
        onClick={createEstimate}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        견적서 생성
      </button>

      <button
        onClick={() => downloadPDF(setHideEditButton)}
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
      >
        PDF 다운로드
      </button>

      {amount !== null && (
        <EstimateTemplate
          amount={amount}
          customerDetails={customerDetails}
          validityDate={validityDate}
          items={items}
          toggleEdit={toggleEdit}
          hideEditButton={hideEditButton}
        />
      )}
    </div>
  );
};

export default MainForm;
