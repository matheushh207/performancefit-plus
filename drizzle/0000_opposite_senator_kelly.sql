CREATE TABLE `adminUsers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(100) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`email` varchar(320),
	`fullName` text,
	`isActive` boolean DEFAULT true,
	`lastLogin` datetime,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adminUsers_id` PRIMARY KEY(`id`),
	CONSTRAINT `adminUsers_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `diets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`professionalId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('weight_loss','hypertrophy','maintenance','therapeutic') NOT NULL,
	`notes` text,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `diets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`videoUrl` text,
	`imageUrl` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `exercises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `foods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`baseAmount` decimal(8,2),
	`unit` varchar(20) DEFAULT 'g',
	`calories` decimal(8,2),
	`protein` decimal(8,2),
	`carbs` decimal(8,2),
	`fats` decimal(8,2),
	`fiber` decimal(8,2),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `foods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `insights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`professionalId` int NOT NULL,
	`studentId` int NOT NULL,
	`type` enum('retention','performance','nutrition','health') NOT NULL,
	`priority` enum('low','medium','high') DEFAULT 'medium',
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`suggestedAction` text,
	`isResolved` boolean DEFAULT false,
	`resolvedAt` datetime,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `insights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dietId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`time` varchar(5),
	`order` int DEFAULT 0,
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `meals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subscriptionId` int NOT NULL,
	`amount` decimal(10,2),
	`paymentDate` datetime NOT NULL,
	`status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
	`paymentMethod` varchar(50),
	`transactionId` varchar(255),
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `physicalEvaluations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`evaluationDate` datetime NOT NULL,
	`weight` decimal(6,2),
	`height` decimal(5,2),
	`imc` decimal(5,2),
	`bodyFatPercentage` decimal(5,2),
	`leanMass` decimal(6,2),
	`fatMass` decimal(6,2),
	`postureNotes` text,
	`observations` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `physicalEvaluations_id` PRIMARY KEY(`id`)
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
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `professionalSubscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `professionals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` varchar(64) DEFAULT '',
	`fullName` text NOT NULL,
	`email` varchar(320) NOT NULL,
	`cpf` varchar(14) NOT NULL,
	`phone` varchar(20) DEFAULT '',
	`type` enum('personal_trainer','nutritionist','both') NOT NULL,
	`specialization` text DEFAULT (''),
	`licenseNumber` varchar(100) DEFAULT '',
	`isActive` boolean DEFAULT true,
	`passwordHash` varchar(255) DEFAULT '',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `professionals_id` PRIMARY KEY(`id`),
	CONSTRAINT `professionals_email_unique` UNIQUE(`email`),
	CONSTRAINT `professionals_cpf_unique` UNIQUE(`cpf`)
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`instructions` text,
	`prepTime` int,
	`servings` int,
	`calories` decimal(8,2),
	`protein` decimal(8,2),
	`carbs` decimal(8,2),
	`fats` decimal(8,2),
	`imageUrl` text,
	`isPublic` boolean DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `recipes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`professionalId` int NOT NULL,
	`fullName` text NOT NULL,
	`cpf` varchar(14) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20) DEFAULT '',
	`birthDate` date,
	`gender` enum('male','female','other'),
	`objective` text,
	`notes` text,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `students_id` PRIMARY KEY(`id`),
	CONSTRAINT `students_cpf_unique` UNIQUE(`cpf`)
);
--> statement-breakpoint
CREATE TABLE `subscriptionPlans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`type` enum('personal_trainer','nutritionist','both') NOT NULL,
	`monthlyPrice` decimal(10,2),
	`features` text,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `subscriptionPlans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`professionalId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('hypertrophy','strength','resistance','weight_loss') NOT NULL,
	`notes` text,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `diets` ADD CONSTRAINT `diets_studentId_students_id_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `diets` ADD CONSTRAINT `diets_professionalId_professionals_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `professionals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `insights` ADD CONSTRAINT `insights_professionalId_professionals_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `professionals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `insights` ADD CONSTRAINT `insights_studentId_students_id_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meals` ADD CONSTRAINT `meals_dietId_diets_id_fk` FOREIGN KEY (`dietId`) REFERENCES `diets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_subscriptionId_professionalSubscriptions_id_fk` FOREIGN KEY (`subscriptionId`) REFERENCES `professionalSubscriptions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `physicalEvaluations` ADD CONSTRAINT `physicalEvaluations_studentId_students_id_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `professionalSubscriptions` ADD CONSTRAINT `professionalSubscriptions_professionalId_professionals_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `professionals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `professionalSubscriptions` ADD CONSTRAINT `professionalSubscriptions_planId_subscriptionPlans_id_fk` FOREIGN KEY (`planId`) REFERENCES `subscriptionPlans`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `students` ADD CONSTRAINT `students_professionalId_professionals_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `professionals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workouts` ADD CONSTRAINT `workouts_studentId_students_id_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workouts` ADD CONSTRAINT `workouts_professionalId_professionals_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `professionals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `professionals_email_idx` ON `professionals` (`email`);--> statement-breakpoint
CREATE INDEX `professionals_cpf_idx` ON `professionals` (`cpf`);