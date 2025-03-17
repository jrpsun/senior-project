const popupTexts = {
  TH: {
      success: {
          title: "ลงทะเบียนเสร็จสมบูรณ์",
          message: "คุณได้ลงทะเบียนสำเร็จแล้ว โปรดเข้าสู่ระบบเพื่อดำเนินการต่อ",
          image: "/images/success-icon.svg",
          buttonText: "ปิด",
      },
      error: {
          title: "ไม่สามารถลงทะเบียนได้",
          message: "ข้อมูลของคุณมีอยู่ในระบบแล้ว กรุณาลองเข้าสู่ระบบเพื่อตรวจสอบ\nหากพบปัญหาในการเข้าสู่ระบบ กรุณาติดต่อเจ้าหน้าที่เพื่อขอความช่วยเหลือ",
          image: "/images/error-icon.svg",
          buttonText: "ตกลง",
      },
      confirmation: {
          title: "ยืนยันการลงทะเบียน?",
          message: "โปรดตรวจสอบข้อมูลให้ครบถ้วนก่อนดำเนินการ\nหากข้อมูลถูกต้อง กรุณากด “ตกลง” เพื่อยืนยัน",
          image: "/images/warning-icon.svg",
          buttonText: "ตกลง",
      },
      successInfo: {
          title: "บันทึกข้อมูลเรียบร้อย",
          message: "ระบบได้บันทึกการเปลี่ยนแปลงของคุณสำเร็จ",
          buttonText: "ปิด",
          image: "/images/success-icon.svg",
      },
      errorPasswordInfo: {
          title: "รหัสผ่านปัจจุบันไม่ถูกต้อง",
          message: "กรุณากรอกรหัสผ่านใหม่อีกครั้ง",
          buttonText: "ปิด",
          image: "/images/error-icon.svg",
      },
      deleteConfirmation: {
          title: "ต้องการลบรายการนี้หรือไม่ ?",
          message: "",
          buttonText: "ใช่",
          cancelText: "ไม่ใช่",
          image: "/images/warning-icon.svg",
      },
      confirmApplication: {
        title: "ยืนยันการสมัครหรือไม่ ?",
        message: "โปรดตรวจสอบข้อมูลให้ครบถ้วนก่อนดำเนินการ\nหากยืนยันจะไม่สามารถแก้ไขข้อมูลการสมัครได้",
        buttonText: "ยืนยัน",
        image: "/images/warning_icon.svg",
      },
      applicationSuccess: {
        title: "การสมัครสำเร็จแล้ว",
        message: "ท่านได้ส่งข้อมูลการสมัครเรียบร้อยแล้ว\nกรุณาชำระเงินและติดตามสถานะการสมัครผ่านระบบ",
        buttonText: "ปิด",
        image: "/images/success_icon.svg", 
      },
      cancelApplication: {
        title: "ยืนยันการยกเลิกการสมัคร?",
        message: "เมื่อยืนยัน การสมัครจะถูกยกเลิกทันทีและไม่สามารถแก้ไขหรือกู้คืนได้",
        buttonText: "ยืนยันการยกเลิก",
        cancelButton: "ยกเลิก",
        reasonLabel: "โปรดระบุสาเหตุในการยกเลิก",
        selectReasonPlaceholder: "เลือกสาเหตุ",
        additionalDetailsLabel: "รายละเอียดเพิ่มเติม",
        additionalDetailsPlaceholder: "กรุณาระบุรายละเอียดเพิ่มเติม",
        image: "/images/info_icon.svg",
      },
      cancelSuccess: {
        title: "ยกเลิกการสมัครเรียบร้อยแล้ว",
        message: "การยกเลิกการสมัครของคุณได้ดำเนินการเสร็จสิ้นแล้ว\nหากต้องการสมัครใหม่ กรุณาดำเนินการผ่านระบบอีกครั้ง",
        buttonText: "ปิด",
        image: "/images/success_icon.svg"
      }
  },
  ENG: {
      success: {
          title: "Registration Completed",
          message: "Your registration is successful.\nPlease login to proceed.",
          image: "/images/success-icon.svg",
          buttonText: "Close",
      },
      error: {
          title: "Unable to Register",
          message: "Your information is already in the system.\nPlease login or contact support for help.",
          image: "/images/error-icon.png",
          buttonText: "Confirm",
      },
      confirmation: {
          title: "Confirm Registration?",
          message: "Please verify your information before proceeding.\nClick “Confirm” if everything is correct.",
          image: "/images/warning-icon.svg",
          buttonText: "Confirm",
      },
      successInfo: {
          title: "Data Saved Successfully",
          message: "Your changes have been saved successfully.",
          buttonText: "Close",
          image: "/images/success-icon.svg",
      },
      errorPasswordInfo: {
          title: "Current password is incorrect",
          message: "Please re-enter your new password.",
          buttonText: "Close",
          image: "/images/error-icon.svg",
      },
      deleteConfirmation: { 
          title: "Delete this item?",
          message: "",
          buttonText: "Yes",
          cancelText: "No",
          image: "/images/warning-icon.svg",
      },
      confirmApplication: {
        title: "Confirm your application?",
        message: "Please check your information before proceeding.\nOnce confirmed, you cannot edit your application.",
        buttonText: "Confirm",
        image: "/images/warning_icon.svg",
      },
      applicationSuccess: {
        title: "Application Successful",
        message: "Your application has been successfully submitted.\nPlease proceed with payment and check your application status.",
        buttonText: "Close",
        image: "/images/success_icon.svg",
      },
      cancelApplication: {
        title: "Confirm Application Cancellation?",
        message: "Cancellation is final and cannot be undone.",
        buttonText: "Confirm Cancellation",
        cancelButton: "Cancel",
        reasonLabel: "Please specify the reason for cancellation",
        selectReasonPlaceholder: "Select Reason",
        additionalDetailsLabel: "Additional Details",
        additionalDetailsPlaceholder: "Please provide additional details",
        image: "/images/info_icon.svg",
      },
      cancelSuccess: {
        title: "Cancellation Confirmed",
        message: "Your application has been successfully canceled.\nIf you wish to reapply, please proceed through the system again.",
        buttonText: "Close",
        image: "/images/success_icon.svg"
      }
  },
};

export default popupTexts;
