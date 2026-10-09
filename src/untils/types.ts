export type JWTPayloadType = {
  id: string;
  role: string;
  userName: string;
  email: string;
};

export type AccessTokenType = {
  accessToken: string;
};

export type IoredisStore = {
  del: (key: string) => Promise<void>;
  get: (key: string) => Promise<any>;
  set: (key: string, value: any, ttl?: number) => Promise<void>;
};