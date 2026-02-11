ALTER TABLE `professionals` DROP INDEX `professionals_userId_unique`;--> statement-breakpoint
ALTER TABLE `professionals` DROP FOREIGN KEY `professionals_userId_users_openId_fk`;
--> statement-breakpoint
ALTER TABLE `professionals` MODIFY COLUMN `userId` varchar(64);--> statement-breakpoint
ALTER TABLE `professionals` ADD CONSTRAINT `professionals_email_unique` UNIQUE(`email`);--> statement-breakpoint
CREATE INDEX `professionals_email_idx` ON `professionals` (`email`);--> statement-breakpoint
CREATE INDEX `professionals_cpf_idx` ON `professionals` (`cpf`);