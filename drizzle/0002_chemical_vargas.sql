CREATE TABLE `adminUsers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(100) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`email` varchar(320),
	`fullName` text,
	`isActive` boolean DEFAULT true,
	`lastLogin` datetime,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adminUsers_id` PRIMARY KEY(`id`),
	CONSTRAINT `adminUsers_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subscriptionId` int NOT NULL,
	`amount` decimal,
	`paymentDate` datetime NOT NULL,
	`status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
	`paymentMethod` varchar(50),
	`transactionId` varchar(255),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `professionalSubscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`professionalId` int NOT NULL,
	`planId` int NOT NULL,
	`startDate` datetime NOT NULL,
	`renewalDate` datetime NOT NULL,
	`status` enum('active','inactive','cancelled','expired') DEFAULT 'active',
	`paymentMethod` varchar(50),
	`lastPaymentDate` datetime,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `professionalSubscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `professionalSubscriptions_professionalId_unique` UNIQUE(`professionalId`)
);
--> statement-breakpoint
CREATE TABLE `subscriptionPlans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`type` enum('personal_trainer','nutritionist','both') NOT NULL,
	`monthlyPrice` decimal,
	`features` text,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscriptionPlans_id` PRIMARY KEY(`id`)
);
