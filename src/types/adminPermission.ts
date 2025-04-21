export interface AdminPermission {
    adminId?: string;
    prefix?: string; 
    firstName?: string; 
    lastName?: string; 
    email?: string; 
    phoneNumber?: string; 
    roles?: string[];
    lastSeen?: string;
    username?: string;
    password?: string;
}