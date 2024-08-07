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
  categories: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

declare type Booking = {
  id: string;
  eventId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: User;
};
declare type EventInfo = {
  bookings: Booking[];
  eventInfo: SocialEvent;
  ownerInfo: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
};

declare type Category = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

declare type Message = {
  chatRoomId: string;
  content: string;
  createdAt: string;
  id: string;
  userId: string;
  user: User;
};

declare type CreateEventResponse = {
  statusCode: number;
  message: string;
  event: SocialEvent;
};
