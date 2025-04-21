export interface EducationBackground {
    academicType?: string; // degree
    currentStatus?: string; // 
    graduateDate?: string; // graduationDate
    graduateYear?: string; /// add
    academicCountry?: string; // country
    academicProvince?: string; // province
    schoolName?: string; // schoolName
    studyPlan?: string; // major
    customAcademicType?: string; /// add typeอื่นๆ
    customStudyPlan?: string; /// add สาขาอื่นๆ
    cumulativeGPA?: string; //
    dstEnglish?: string; // gpaEnglish
    dstMathematics?: string; // gpaMath
    dstScitech?: string; // gpaScience
    comSciTitle?: string; // ComputerScienceSubject
    comSciCredit?: string; // computerTotalCredit
    gedMathematics?: string; // ged
    gedScience?: string; // ged
    gedSocialStudies?: string; // ged
    gedLanguageArts?: string; // ged
    g12MathCredit?: string; // g12 
    g12MathTitle?: string; // g12
    g12SciCredit?: string; // g12
    g12SciTitle?: string; // g12
    g12EnCredit?: string; // g12
    g12EnTitle?: string; // g12
    docCopyTrans?: string; // transcript
    docCopyName?: string;
    docCopySize?: string;
}


export interface EducationEngExam {
    examType?: string; // testType
    enScore?: string; // score
    enExamDate?: string; // testDate
    listening?: string; // listeningScore
    speaking?: string; // speakingScore
    reading?: string; // readingScore
    writing?: string;// writingScore
    literacy?: string; // literacyScore
    comprehension?: string; // comprehensionScore
    conversation?: string; // conversationScore
    production?:string; // productionScore
    listeningComprehensionScore?: string; /// add
    structureWrittenScore?: string; /// add
    readingComprehensionScore?: string; /// add
    enCer?: string; // document
    enCerName?: string;
    enCerSize?: string;
}


export interface EducationMathExam {
    mathType?: string;
    mathScore?: string;
    mathExamDate?: string;
    mathCer?: string;
    mathCerName?: string;
    mathCerSize?: string;
}


export interface ApplicantEducationResponse {
    background: EducationBackground;
    eng_exam: EducationEngExam;
    math_exam: EducationMathExam
}


export interface OCRTranscriptICTResponse {
    firstname?: string;
    lastname?: string;
    academicProvince?: string;
    schoolName?: string;
    cumulativeGPA?: string;
}


export interface EducantionApplicantView {
    roundName: string;
    applicantId: string;
    firstnameEN: string;
    lastnameEN: string;
    program: string;
    admissionStatus: string;
    docStatus: string;
    paymentStatus: string;
    academicYear: string;
}


export interface ApplicantProblem {
    applicantId: string;
    details: string;
    educationId: string;
    problemId: string;
    updateDate: string;
}