export type TokenApplicantPayload = {
    sub: string;
    appId: string;
    exp: number;
  };


export type TokenAdminPayload = {
  sub: string;
  id: string;
  email: string;
  roles: string[];
  exp: number;
}