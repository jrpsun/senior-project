// mockApplicant.ts

export interface Applicant {
    id: string;
    name: string;
    room: string;
    englishScore: number | null;
    personalityScore: number | null;
    intentionScore: number | null;
    computerScore: number | null;
    totalScore: number | null;
    interviewResult: string; // "ผ่าน", "ไม่ผ่าน", "รอ"
  }
  
  export interface GroupedData {
    room: string;
    committeeName: string;
    course: string; // Added course property
    round?: string; // Added round property
    applicants: Applicant[];
    passed?: number;
    failed?: number;
    pending?: number;
    notInterview?: number;
    waitingEval?: number;
    averageScore?: number;
    avgEnglishScore?: number;
    avgPersonalityScore?: number;
    avgIntentionScore?: number;
    avgComputerScore?: number;
}
  
  export const mockGroupedData: GroupedData[] = [
    {
      committeeName: "อ. วรพงษ์, อ. อารดา",
      room: "ห้อง IT 123",
      course: "ICT01",
      round: "1/68 - ICT Portfolio",
      applicants: [
        {
          id: "0000003",
          name: "พิชญะ วิสุทธิ์",
          room: "IT 123",
          englishScore: 7,
          personalityScore: 7,
          intentionScore: 7,
          computerScore: 2,
          totalScore: 23,
          interviewResult: "ผ่าน",
        },
        {
          id: "0000005",
          name: "อนันต์ โชติกุล",
          room: "IT 123",
          englishScore: 9,
          personalityScore: 6,
          intentionScore: 8,
          computerScore: 3,
          totalScore: 26,
          interviewResult: "ผ่าน",
        },
        {
          id: "0000007",
          name: "วิศรุต พิทักษ์ธรรม",
          room: "IT 123",
          englishScore: 7,
          personalityScore: 8,
          intentionScore: 9,
          computerScore: 2,
          totalScore: 26,
          interviewResult: "ไม่ผ่าน",
        },
        {
          id: "0000013",
          name: "ชยุตม์ วัฒนานนท์",
          room: "IT 123",
          englishScore: 8,
          personalityScore: 7,
          intentionScore: 9,
          computerScore: 2,
          totalScore: 26,
          interviewResult: "ผ่าน",
        },
      ],
    },
    {
      committeeName: "อ. จินต์พิชชา, อ. ชนากานต์",
      course: "ICT01",
      round: "1/68 - ICT Portfolio",
      room: "ห้อง IT 124",
      applicants: [
        {
          id: "0000020",
          name: "ปริญญ์ เกียรติกาญจนา",
          room: "IT 124",
          englishScore: 8,
          personalityScore: 7,
          intentionScore: 7,
          computerScore: 3,
          totalScore: 25,
          interviewResult: "ผ่าน",
        },
        {
          id: "0000032",
          name: "อนุชา สุทธิเพียร",
          room: "IT 124",
          englishScore: 5,
          personalityScore: 5,
          intentionScore: 5,
          computerScore: 2,
          totalScore: 17,
          interviewResult: "ผ่าน",
        },
        {
          id: "0000034",
          name: "อริสรา จิรศิริกุล",
          room: "IT 124",
          englishScore: null,
          personalityScore: null,
          intentionScore: null,
          computerScore: null,
          totalScore: null,
          interviewResult: "ไม่มา",
        }
        
      ],
    },
  ];
  