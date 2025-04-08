export interface GeneralInfoInterface {
  nationality?: string;
  idCardNumber?: string;
  passportId?: string;
  prefix?: string;
  firstnameTH?: string;
  lastnameTH?: string;
  firstnameEN?: string;
  lastnameEN?: string;
  idCardExpDate?: string;
  passportExpDate?: string;
  gender?: string;
  middlenameTH?: string;
  middlenameEN?: string;
  nicknameTH?: string;
  nicknameEN?: string;
  birthDate?: string;
  livingCountry?: string;
  applicantPicture?: string; // สำหรับเก็บรูปภาพเป็น base64
  profileImageUrl?: string; // สำหรับแสดงผล (URL หรือ base64)
  docCopyIdCard?: string;
  docCopyIdCardName?: string;
  docCopyIdCardSize?: string;
  docCopyPassport?: string;
  docCopyPassportName?: string;
  docCopyPassportSize?: string;
  docCopyHouseRegis?: string
  docCopyHouseRegisName?: string
  docCopyHouseRegisSize?: string

  houseNumber?: string;
  moo?: string;
  subDistrict?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  village?: string;
  soi?: string;
  street?: string;
  addr1?: string;
  addr2?: string;
  country?: string;
  city?: string;
}
  
export interface ContactInfoInterface {
  applicantPhone?: string;
  applicantEmail?: string;
  line?: string;
  facebook?: string;
  instagram?: string;
}


export interface EmergencyContactInterface {
  contactFirstNameTH?: string;
  contactMiddleNameTH?: string;
  contactLastNameTH?: string;
  contactFirstNameEN?: string;
  contactMiddleNameEN?: string;
  contactLastNameEN?: string;
  relationship?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface AdmissionChannelInterface {
  onlineChannel?: string;
  offlineChannel?: string;
}

export interface ApplicantGeneralInformationResponse {
  general_info: GeneralInfoInterface;
  contact_info: ContactInfoInterface;
  emergency_contact: EmergencyContactInterface;
  admission_channel: AdmissionChannelInterface;
}
  