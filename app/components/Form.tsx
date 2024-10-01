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

interface EstimateTemplateProps {
  amount: number;
  customerDetails: CustomerDetails;
  validityDate: string;
  items: Item[];
  toggleEdit: () => void;
  hideEditButton: boolean;
  templateName: string;
  handleItemChange: (
    index: number,
    field: string,
    value: string | number
  ) => void;
  isEditing: boolean;
}

const templates = [
  { name: "기본 템플릿", percentages: { ten: 0.1, twenty: 0.2, forty: 0.4 } },
  { name: "템플릿 2", percentages: { ten: 0.2, twenty: 0.3, forty: 0.5 } },
  { name: "템플릿 3", percentages: { ten: 0.15, twenty: 0.25, forty: 0.35 } },
];

// 견적서 템플릿 컴포넌트
const EstimateTemplate = ({
  amount,
  customerDetails,
  validityDate,
  items,
  toggleEdit,
  hideEditButton,
  templateName,
  handleItemChange,
  isEditing,
}: EstimateTemplateProps) => {
  return (
    <div
      id="estimate-template"
      className="max-w-2xl mx-auto p-5 border border-gray-300 rounded-lg"
    >
      <h1 className="text-2xl font-bold text-center">
        견적서 - {templateName}
      </h1>
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
              <td className="border px-4 py-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  item.name
                )}
              </td>
              <td className="border px-4 py-2">
                {isEditing ? (
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "unitPrice",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  `${item.unitPrice.toLocaleString()} 원`
                )}
              </td>
              <td className="border px-4 py-2">
                {isEditing ? (
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity",
                        parseInt(e.target.value, 10)
                      )
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  item.quantity
                )}
              </td>
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
    </div>
  );
};

// PDF 다운로드 함수
const downloadPDF = (
  setHideEditButton: (value: boolean) => void,
  setDownloading: (value: boolean) => void
) => {
  setHideEditButton(true); // PDF 다운로드 중일 때 수정 버튼 숨기기
  setDownloading(true); // 다운로드 중 메시지 표시

  // 10초 대기 후 PDF 다운로드 실행
  setTimeout(() => {
    const estimateElement = document.getElementById("estimate-template");

    if (estimateElement) {
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

        setHideEditButton(false); // PDF 다운로드 완료 후 수정 버튼 다시 표시
        setDownloading(false); // 다운로드 완료 후 메시지 숨기기
      });
    }
  }, 10000); // 10초 동안 버튼 숨기기
};

// 메인 폼 컴포넌트
const MainForm = () => {
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 관리
  const [hideEditButton, setHideEditButton] = useState(false); // PDF 다운로드 시 수정 버튼 숨기기
  const [downloading, setDownloading] = useState(false); // 다운로드 중 상태 관리
  const [ticketId, setTicketId] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [validityDate] = useState<string>(
    `${new Date(
      new Date().setDate(new Date().getDate() + 10)
    ).toLocaleDateString()}`
  );
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "상대 고객사",
    contactPerson: "상대 고객사 담당자 성명",
    product: "견적 대상 제품",
    estimateDate: new Date().toLocaleDateString(),
  });
  const [items, setItems] = useState<Item[]>([]);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

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

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
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
          (field: { id: number }) => field.id === 6477667492761
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

    // 선택한 템플릿의 비율을 사용하여 각 비용 항목 계산
    const tenPercent = finalAmount * selectedTemplate.percentages.ten;
    const twentyPercent = finalAmount * selectedTemplate.percentages.twenty;
    const fortyPercent = finalAmount * selectedTemplate.percentages.forty;

    setItems([
      { name: "광고 대행 비용", unitPrice: tenPercent, quantity: 1 },
      { name: "지원사업 간접비", unitPrice: twentyPercent, quantity: 1 },
      { name: "지원사업 직접비", unitPrice: fortyPercent, quantity: 1 },
    ]);

    setAmount(finalAmount);
  };

  return (
    <div>
      {/* 다운로드 중 메시지 표시 */}
      {downloading && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4"></div>
            <h2 className="text-xl font-semibold">다운로드 중...</h2>
            <p className="mt-4 text-green-600">곧 완료됩니다!</p>
          </div>
        </div>
      )}

      {/* 템플릿 선택 및 다운로드 버튼 */}
      <label htmlFor="template-select">템플릿 선택:</label>
      <select
        id="template-select"
        onChange={(e) => {
          const selected = templates.find(
            (template) => template.name === e.target.value
          );
          if (selected) setSelectedTemplate(selected);
        }}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md"
      >
        {templates.map((template, index) => (
          <option key={index} value={template.name}>
            {template.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
        placeholder="티켓 번호 입력"
        className="block w-full px-3 py-2 border border-gray-300 rounded-md mt-4"
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
        onClick={() => downloadPDF(setHideEditButton, setDownloading)}
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
          templateName={selectedTemplate.name}
          handleItemChange={handleItemChange}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default MainForm;
