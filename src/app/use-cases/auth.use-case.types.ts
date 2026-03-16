// register
export interface RegisterIn {
  email: string;
  password: string;
  username: string;
}

export interface RegisterOut {
  userId: string;
}

// stdLogin
export interface StdLoginIn {
  // oneof
  email?: string;
  username?: string;
  password: string;

  // 2fa
  deviceId?: string;
}

export interface StdLoginOut {
  access: string;
  refresh: string;
}

// otpLogin
export interface OtpLoginIn {
  userId: string;
  otpCode: string;

  saveDeviceId: boolean;
  deviceId: string;
}

export interface OtpLoginOut {
  access: string;
  refresh: string;
}
