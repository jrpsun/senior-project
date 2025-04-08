export interface EduScreeningInterface {
    roundName?: string;
    applicantId?: string;
    firstnameEN?: string;
    lastnameEN?: string;
    program?: string;
    admissionStatus?: string;
    docStatus?: string;
    paymentStatus?: string;
    applicantEmail?: string;
    applicantPhone?: string;
}

export interface CourseComScreeningInterface {
    roundName?: string;
    applicantId?: string;
    firstnameEN?: string;
    lastnameEN?: string;
    program?: string;
    admissionStatus?: string;
    docStatus?: string;
    paymentStatus?: string;
    prefix?: string;
    firstName?: string;
    lastName?: string;
    preEvaDate ?: string;
    
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