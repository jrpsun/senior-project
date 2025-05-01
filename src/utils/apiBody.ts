type NewAdmin = {
  adminId?: string;
  prefix: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roles?: string[];
  lastSeen?: string;
  username: string;
  password: string;
};

export const generateAdmissionBody = (newAdmin: NewAdmin, role: string, methodChecker: string, shareId: string) => {
  if (methodChecker === "create") {
    const baseCreate = {
      prefix: newAdmin.prefix,
      firstName: newAdmin.firstName,
      lastName: newAdmin.lastName,
      username: newAdmin.email,
      email: newAdmin.email,
      phoneNumber: newAdmin.phoneNumber,
      password: newAdmin.password,
    };

    switch (role) {
      case "กรรมการหลักสูตร":
        return {
          courseComId: Math.random().toString(36).substring(2, 11),
          ...baseCreate,
        };
      case "กรรมการสัมภาษณ์":
        return {
          interviewComId: Math.random().toString(36).substring(2, 11),
          ...baseCreate,
        };
      case "เจ้าหน้าที่งานการศึกษา":
        return {
          educationId: Math.random().toString(36).substring(2, 11),
          ...baseCreate,
        };
      default:
        return {
          PRid: Math.random().toString(36).substring(2, 11),
          ...baseCreate,
        };
    }
  }

  else if (methodChecker === "role") {
    const baseRole = {
      prefix: newAdmin.prefix,
      firstName: newAdmin.firstName,
      lastName: newAdmin.lastName,
      username: newAdmin.email,
      email: newAdmin.email,
      phoneNumber: newAdmin.phoneNumber,
      password: newAdmin.password,
    };

    switch (role) {
      case "กรรมการหลักสูตร":
        return {
          courseComId: shareId,
          ...baseRole,
        };
      case "กรรมการสัมภาษณ์":
        return {
          interviewComId: shareId,
          ...baseRole,
        };
      case "เจ้าหน้าที่งานการศึกษา":
        return {
          educationId: shareId,
          ...baseRole,
        };
      default:
        return {
          PRid: shareId,
          ...baseRole,
        };
    }
  }

  else {
    const baseEdit = {
      prefix: newAdmin.prefix,
      firstName: newAdmin.firstName,
      lastName: newAdmin.lastName,
      email: newAdmin.email,
      phoneNumber: newAdmin.phoneNumber,
      password: newAdmin.password
    };

    switch (role) {
      case "กรรมการหลักสูตร":
        return {
          ...baseEdit,
        };
      case "กรรมการสัมภาษณ์":
        return {
          ...baseEdit,
        };
      case "เจ้าหน้าที่งานการศึกษา":
        return {
          ...baseEdit,
        };
      default:
        return {
          ...baseEdit,
        };
    }
  }
};
