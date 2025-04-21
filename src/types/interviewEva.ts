export interface InterviewEvaInterface {
    applicantId?: string 
    firstnameEN?: string
    lastnameEN?: string
    interviewComId?: string 
    prefix?: string
    firstName?: string 
    lastName?: string
    interviewRoom?: string
    interviewDate?: string 
    interviewTime?: string 
    englishScore?: number | null
    personalityScore?: number | null
    intensionScore?: number | null
    computerScore?: number | null
    totalScore?: number | null
    englishRemark?: string 
    personalityRemark?: string 
    intensionRemark?: string 
    computerRemark?: string 
    totalRemark?: string 
    comment?: string 
    interviewRemark?: string
}


export interface InterviewEvaList {
    applicants: InterviewEvaInterface[]
}