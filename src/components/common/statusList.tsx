import { statuses, getStatusById, statusStyles } from "../../utils/status";
import { useLanguage } from "../../hooks/LanguageContext";

const useStatusData = () => {
  const { language } = useLanguage(); // ดึงค่าภาษา

  const getSafeStatusById = (category: string, id: string) => {
    const status = getStatusById(category, id) ?? {};
    return {
      ...status,
      style: statusStyles[status.type || "default"], 
    };
  };

  return {
    statuses,
    getStatusById: getSafeStatusById, 
    language,
  };
};

export default useStatusData;

