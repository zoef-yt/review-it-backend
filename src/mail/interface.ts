export interface WelcomeEmail {
  email: string;
  name: string;
}

export interface ResetPasswordRequest {
  email: string;
  name: string;
  url: string;
  time: string;
  ipAddress: string;
  device: string;
}

export interface LoginAlertEmail {
  email: string;
  name: string;
  loginTime: string;
  ipAddress: string;
  resetLink: string;
  device: string;
}

export interface SendChangePasswordEmail {
  email: string;
  name: string;
  time: string;
  ipAddress: string;
  device: string;
  url: string;
}

export type MailResponse =
  | {
      isError: true;
      errorDetails: string;
    }
  | {
      isError: false;
      response: string;
    };
