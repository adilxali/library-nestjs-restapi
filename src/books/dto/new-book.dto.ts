/*
model Book {
  id            Int    @id @default(autoincrement())
  title         String
  author        String
  isbn          String?   @unique
  totalCopies   Int       @default(1)
  available     Int       @default(1)
  publishedAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  borrows       Borrow[]
  @@index([title])
  @@index([author])
}
*/
import { IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';

export class NewBookDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  author: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  publishedYear?: number;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsInt()
  @Min(1)
  totalCopies: number;
}
