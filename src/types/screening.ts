export interface EduScreeningInterface {
    roundName?: string;
    applicantId?: string;
    applicantNumber?: string;
    admissionId?: string;
    firstnameEN?: string;
    lastnameEN?: string;
    program?: string;
    admissionStatus?: string;
    docStatus?: string;
    paymentStatus?: string;
    applicantEmail?: string;
    applicantPhone?: string;
    moreDetail?: string;
    reason?: string;
}

export interface CourseComScreeningInterface {
    roundName?: string;
    applicantId?: string;
    applicantNumber?: string;
    firstnameEN?: string;
    lastnameEN?: string;
    fullnameEN?: string;
    program?: string;
    admissionStatus?: string;
    docStatus?: string;
    paymentStatus?: string;
    courseComId?: string;
    prefix?: string;
    firstName?: string;
    lastName?: string;
    preEvaDate?: string;
    preliminaryEva?: string;
    preliminaryComment?: string;
    
}

export interface InterviewComScreeningInterface {
    roundName?: string;
    applicantId?: string;
    firstnameEN?: string;
    lastnameEN?: string;
    program?: string;
    admissionStatus?: string;
    docStatus?: string;
    interviewStatus?: string;
    interviewRoom?: string;
    prefix1?: string;
    firstName1?: string;
    lastName1?: string;
    prefix2?: string;
    firstName2?: string;
    lastName2?: string;
    interviewDate?: string; 
    interviewTime?: string;
    
}


export interface EduScreeningGroupingAllCourseComInterface {
    courseComId?: string;
    prefix?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    phoneNumber?: string;
}


export interface CommitteeResult {
    id?: string;
    shortName?: string;
    name?: string;
    InterviewResult?: string;
  }
  
export interface InterviewScreeningForEduInterface {
    interviewStatus?: string;
    admissionStatus?: string;
    docStatus?: string;
    paymentStatus?: string;
    interviewRoom?: string; 
    interviewDate?: string;
    interviewTime?: string;
    englishScore?: number; 
    personalityScore?: number; 
    intensionScore?: number; 
    computerScore?: number; 
    totalScore?: number;

    applicantId?: string;
    firstnameEN?: string;
    lastnameEN?: string;
    fullnameEN?: string;
    programRegistered?: string;
    program?: string;
    roundName?: string;

    InterviewCommittee?: CommitteeResult[];
}
  
  