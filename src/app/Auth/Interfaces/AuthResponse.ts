export interface AuthResponse {
  data: {
    name:string;
    token: string;
    expiration: string;
  };
   isSuccess: boolean;
  message: string;
  errors: any;
}
