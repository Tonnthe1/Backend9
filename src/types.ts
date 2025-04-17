// src/types.ts
import { Request } from 'express';

export interface UserPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}