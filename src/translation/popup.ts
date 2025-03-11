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
            message:  "กรุณากรอกรหัสผ่านใหม่อีกครั้ง",
            buttonText: "ปิด",
            image: "/images/error-icon.svg",
          },
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
    },
};

export default popupTexts;
