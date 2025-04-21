// types/interview.ts
export interface InterviewCommitteeMember {
    interviewComId?: string;
    prefix?: string;
    firstName?: string;
    lastName?: string;
}

export interface InterviewRoundDetailResponse {
    interviewRoundId?: string;
    interviewDate?: string;
    interviewStartTime?: string;
    interviewEndTime?: string;
    admissionProgram?: string;
    admissionRoundName?: string;
    interviewRoomId?: string;
    interviewRoom?: string;
    interviewType?: string;
    interviewComs: InterviewCommitteeMember[];
}

export interface InterviewRoundDetailListResponse {
    details: InterviewRoundDetailResponse[];
}
