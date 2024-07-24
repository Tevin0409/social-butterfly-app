declare type User = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  county: string;
  postalCode: string;
  identificationNumber: string;
  password?: string;
  id?: string;
};

declare type ValidationError = {
  code: string;
  minimum?: number;
  type: string;
  inclusive?: boolean;
  exact?: boolean;
  message: string;
  path: string[];
};

declare type ErrorResponse = {
  message: string;
  errorCode: number;
  errors: {
    issues: ValidationError[];
    name: string;
  };
};

declare type AuthResponse = {
  message: string;
  userInfo: User;
  token: string;
};
