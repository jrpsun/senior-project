import { statuses, getStatusById, statusStyles } from "../../utils/status";
import { useLanguage } from "../../hooks/LanguageContext";

const useStatusData = () => {
  const { language } = useLanguage(); // ดึงค่าภาษา

  const getSafeStatusById = (category: "application" | "documents" | "payment" | "interview", id: string) => {
    const status = getStatusById(category, id) ?? { type: "default" };
    return {
      ...status,
      style: statusStyles[status.type], 
    };
  };

  return {
    statuses,
    getStatusById: getSafeStatusById, 
    language,
  };
};

export default useStatusData;

