export type JwtPayload = {
  email: string;
  sub: number; // ユーザーID（JWTの標準フィールド）
}

export type AuthenticatedUser = {
  id: number;
  email: string;
  name: string | null;
}