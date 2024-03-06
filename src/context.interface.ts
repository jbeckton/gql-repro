import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

export interface MyContext {
  req: Request;
  prisma: PrismaClient;
  token?: string;
}
