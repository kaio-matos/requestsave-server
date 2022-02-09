/*
  Warnings:

  - Added the required column `account_id` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Request` ADD COLUMN `account_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
