export interface IAuth {
  token: string;
}

interface IRSAKey {
  public_key: string;
  private_key: string;
}

export interface IUserModel extends IAuth {
  first_name: string;
  last_name: string;
  email: string;
  telephone: string;
  rsa_key: IRSAKey;
}

export interface ILogin {
  username: string;
  password: string;
}

export interface IRegister {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  telephone: string;
}

export interface IDecodedToken {
  user: IUserModel;
  private_key: string;
}
