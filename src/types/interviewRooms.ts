export interface CommitteeResult {
    interviewComId?: string;
    prefix?: string;
    firstName?: string;
    lastName?: string;
  }
  
export interface InterviewRoomDetails {
    interviewRoomId?: string;  
    interviewRoom?: string;  
    interviewComs: CommitteeResult[]
    interviewRoundId?: string; 
    interviewDate?: string; 
    startTime?: string; 
    endTime?: string; 
    duration?: string; 
}


export interface InterviewSlot {
  interviewRoundId?: string; 
  interviewRoom?: string; 
  interviewTime?: string[]; 
}