import Image from "next/image";

interface PopupProps {
  type: "success" | "error" | "confirmation";
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function Popup({ type, isOpen, onClose, onConfirm }: PopupProps) {
  if (!isOpen) return null;

  const popupData = {
    success: {
      title: "ลงทะเบียนเสร็จสมบูรณ์",
      message: "คุณได้ลงทะเบียนสำเร็จแล้ว โปรดเข้าสู่ระบบเพื่อดำเนินการต่อ",
      image: "/images/success-icon.png",
      buttonText: "ปิด",
    },
    error: {
      title: "ไม่สามารถลงทะเบียนได้",
      message:
        "ข้อมูลของคุณมีอยู่ในระบบแล้ว กรุณาลองเข้าสู่ระบบเพื่อตรวจสอบ\nหากพบปัญหาในการเข้าสู่ระบบ กรุณาติดต่อเจ้าหน้าที่เพื่อขอความช่วยเหลือ",
      image: "/images/error-icon.png",
      buttonText: "ตกลง",
    },
    confirmation: {
      title: "ยืนยันการลงทะเบียน ?",
      message: "โปรดตรวจสอบข้อมูลให้ครบถ้วนก่อนดำเนินการ\nหากข้อมูลถูกต้อง กรุณากด “ตกลง” เพื่อยืนยัน",
      image: "/images/warning-icon.png",
      buttonText: "ตกลง",
    },
  };

  const { title, message, image, buttonText } = popupData[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[550px] h-[300px] p-6 rounded-lg shadow-lg text-center border border-gray-300 flex flex-col justify-center">
        <div className="flex justify-center mb-4">
          <Image src={image} alt={type} width={80} height={80} />
        </div>
        <h2 className="text-2xl font-bold text-[#008A90]">{title}</h2>
        <p className="text-[#565656] mt-2 whitespace-pre-line">{message}</p>
        <div className="flex justify-center mt-4 gap-4">
          {type === "confirmation" ? (
            <>
              <button
                onClick={onConfirm}
                className="w-[110px] h-[56px] bg-[#008A90] text-white rounded-lg"
              >
                {buttonText}
              </button>
              <button
                onClick={onClose}
                className="w-[110px] h-[56px] border border-gray-400 rounded-lg text-gray-600 bg-white"
              >
                ยกเลิก
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-[110px] h-[56px] bg-[#008A90] text-white rounded-lg"
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
