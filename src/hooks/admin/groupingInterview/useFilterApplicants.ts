import { useMemo } from "react";
import { InterviewScreeningForEduInterface } from "@components/types/screening";

// interface Applicant {
//   course: string;
//   round: string;
//   admitStatus: string;
//   docStatus: string;
//   paymentStatus: string;
//   applicantId: string;
//   name: string;
//   committee?: string[];
//   interviewRoom: string;
// }

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


export const useFilterApplicants = (applicantData: InterviewScreeningForEduInterface[], filters: Filters) => {
  return useMemo(() => {
    return applicantData.filter(app =>
      (!filters.course || app.program === filters.course) &&
      (!filters.round || app.roundName === filters.round) &&
      (!filters.admitStatus || app.admissionStatus === filters.admitStatus) &&
      (!filters.docStatus || app.docStatus === filters.docStatus) &&
      (!filters.paymentStatus || app.paymentStatus === filters.paymentStatus) &&
      (!filters.applicantId || app.applicantId?.includes(filters.applicantId)) &&
      (!filters.name || app.fullnameEN?.includes(filters.name)) &&
      (!filters.committee ||
        (app.InterviewCommittee &&
          app.InterviewCommittee.some(c =>
            normalize(c.name || c.shortName || "").includes(normalize(filters.committee!))
          )))
       &&
      (!filters.interviewRoom || app.interviewRoom === filters.interviewRoom)
    );
  }, [applicantData, filters]);
};
