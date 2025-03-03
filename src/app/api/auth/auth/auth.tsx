import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        citizenId: { label: "หมายเลขบัตรประชาชน / Passport", type: "text" },
        password: { label: "รหัสผ่าน", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Credentials are missing");
        }

        const user = getUserFromDatabase(credentials.citizenId);

        if (user && user.password === hashPassword(credentials.password)) {
          return { id: user.citizenId, ...user }
        } else {
          throw new Error("หมายเลขบัตรประชาชนหรือรหัสผ่านไม่ถูกต้อง")
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  }
})
function getUserFromDatabase(citizenId: string) {
  // Mock implementation, replace with actual database call
  const users = [
    { citizenId: "123456789", password: "hashedPassword123" }
  ];
  return users.find(user => user.citizenId === citizenId) || null;
}

import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}
