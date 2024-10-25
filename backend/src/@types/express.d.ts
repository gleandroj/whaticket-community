declare namespace Express {
  export interface Request {
    user: {
      isApiToken?: boolean;
      id: string;
      profile: string;
      companyId?: number;
    };
  }
}
