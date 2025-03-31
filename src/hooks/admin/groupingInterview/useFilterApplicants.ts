import { useMemo } from "react";

interface Applicant {
  course: string;
  round: string;
  admitStatus: string;
  docStatus: string;
  paymentStatus: string;
  applicantId: string;
  name: string;
  committee?: string[];
  interviewRoom: string;
}

interface Filters {
  course?: string;
  round?: string;
  admitStatus?: string;
  docStatus?: string;
  paymentStatus?: string;
  applicantId?: string;
  name?: string;
  committee?: string;
  interviewRoom?: string;
}

// ฟังก์ชัน normalize เพื่อลบคำนำหน้าหรือช่องว่าง
const normalize = (text: string) =>
  text.replace(/(อาจารย์|ดร\.|อ\.)/g, "").replace(/\s+/g, "").toLowerCase();


export const useFilterApplicants = (applicantData: Applicant[], filters: Filters) => {
  return useMemo(() => {
    return applicantData.filter(app =>
      (!filters.course || app.course === filters.course) &&
      (!filters.round || app.round === filters.round) &&
      (!filters.admitStatus || app.admitStatus === filters.admitStatus) &&
      (!filters.docStatus || app.docStatus === filters.docStatus) &&
      (!filters.paymentStatus || app.paymentStatus === filters.paymentStatus) &&
      (!filters.applicantId || app.applicantId.includes(filters.applicantId)) &&
      (!filters.name || app.name.includes(filters.name)) &&
      (!filters.committee ||
        (app.committee &&
          app.committee.some(c =>
            normalize(c).includes(normalize(filters.committee!))
          ))) &&
      (!filters.interviewRoom || app.interviewRoom === filters.interviewRoom)
    );
  }, [applicantData, filters]);
};
