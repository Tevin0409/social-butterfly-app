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

declare type Photo = {
  url: string;
  name: string;
};

declare type SocialEvent = {
  title: string;
  description: string;
  price: number;
  location: {
    name?: string;
    longitude: number;
    latitude: number;
  };
  mapData: {
    longitude: number;
    latitude: number;
    longitudeDelta: number;
    latitudeDelta: number;
  };
  photos: Photo[];
  eventCreatedById?: string;
  id?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};
