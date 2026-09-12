import {
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      throw new NotFoundException('Related data or relations not found.');
    }
    if (error.code === 'P2002') {
      throw new ConflictException('Data already exists (duplicate).');
    }
  }

  if (error instanceof HttpException) {
    throw error;
  }

  console.error('Unhandled Database / Server Error:', error);
  throw new InternalServerErrorException(
    error instanceof Error ? error.message : 'An error occurred on the server',
  );
}
