export const API_URL = "http://localhost:8000";


type RegisterInput = {
    idNumber: string;
    idType: string;
    email: string;
    title: string;
    firstNameEnglish: string;
    firstNameThai?: string;
    lastNameEnglish: string;
    lastNameThai?: string;
    nationality: string;
    password: string; 
}


export async function login(idNumber: string, password: string) {
    const res = await fetch(`${API_URL}/applicant/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idNumber, password }),
    });

    const data = await res.json();
    if (!res.ok) {
        console.error("Error details:", data);
        throw new Error(data.detail || "Login failed");
    }
    localStorage.setItem("access_token", data.access_token);
    return data;
}


export async function register(formData: RegisterInput) {
    const res = await fetch(`${API_URL}/applicant/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Register failed");

    return data;
}


export function logout() {
    localStorage.removeItem("access_token");
}


export const authFetch = async (url: string, options: RequestInit = {}) => {
    let token = localStorage.getItem("access_token");
  
    const makeRequest = async (accessToken: string) => {
      return await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
    };
  
    let res = await makeRequest(token || "");
  
    if (res.status === 401) {
      const refreshRes = await fetch(`${process.env.API_BASE_URL}/applicant/refresh-token`, {
        method: "POST",
        credentials: "include", // เพื่อส่ง refresh_token ใน cookie
      });
  
      if (refreshRes.ok) {
        const { access_token: newToken } = await refreshRes.json();
        localStorage.setItem("access_token", newToken);
        res = await makeRequest(newToken);
      } else {
        window.location.href = "/login";
      }
    }
  
    return res;
};
  