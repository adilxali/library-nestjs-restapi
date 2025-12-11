/*model Book {
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
} */

export interface Book {
  id?: number;
  title: string;
  author: string;
  isbn?: string | null;
  totalCopies: number;
  available?: number;
  publishedAt?: Date | null;
}
