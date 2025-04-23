import { useRouter } from 'next/navigation';
import Image from "next/image";


const Modal = ({ role }: { role: string }) => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    if (role === "applicant") {
      router.push('/login');
    }
    else if (role === "admin") {
      router.push('/admin/login')
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="relative bg-white w-[550px] h-[300px] rounded-lg shadow-lg text-center border border-gray-300 flex flex-col justify-center">
    {/* ส่วนรูปภาพ */}
    <div className="flex justify-center mb-4">
      <Image src="/images/warning-icon.svg" alt="confirmation" width={80} height={80} />
    </div>
  
    {/* หัวข้อและข้อความ */}
    <h2 className="text-2xl font-bold text-[#008A90]">You are not signed in</h2>
    <p className="text-[#565656] mt-2 whitespace-pre-line">please sign in to continue</p>
  
    {/* ปุ่มกด */}
    <div className="flex justify-center mt-4 gap-4">
      <button
        onClick={handleLoginRedirect}
        className="w-[110px] h-[56px] bg-[#008A90] text-white rounded-lg flex items-center justify-center"
      >
        Login
      </button>
    </div>
  </div>
</div>
  );
};

export default Modal;

