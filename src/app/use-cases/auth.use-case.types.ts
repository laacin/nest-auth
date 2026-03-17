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

// create2FA
export interface Create2FAIn {
  userId: string;
}

export interface Create2FAOut {
  otpUri: string;
}

// enable2FA
export interface Enable2FAIn {
  userId: string;
  otpCode: string;
}

export interface Enable2FAOut {
  userId: string;
}
