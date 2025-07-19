/*
  Warnings:

  - You are about to drop the column `save_path` on the `images` table. All the data in the column will be lost.
  - Added the required column `full_path` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images" DROP COLUMN "save_path",
ADD COLUMN     "full_path" TEXT NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL;
