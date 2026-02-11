CREATE TABLE `alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`type` enum('stagnation','inconsistency','overload','aggressive_deficit','suggestion') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`severity` enum('info','warning','critical') DEFAULT 'info',
	`isResolved` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`professionalId` int NOT NULL,
	`studentId` int NOT NULL,
	`appointmentType` enum('evaluation','consultation','follow_up') NOT NULL,
	`scheduledDate` datetime NOT NULL,
	`duration` int,
	`notes` text,
	`completed` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bioimpedance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evaluationId` int NOT NULL,
	`bodyFatPercentage` decimal,
	`leanMassPercentage` decimal,
	`bodyWaterPercentage` decimal,
	`boneMass` decimal,
	`visceralFat` decimal,
	`basalMetabolism` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bioimpedance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `circumferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evaluationId` int NOT NULL,
	`neck` decimal,
	`shoulder` decimal,
	`chest` decimal,
	`relaxedArm` decimal,
	`contractedArm` decimal,
	`forearm` decimal,
	`waist` decimal,
	`abdomen` decimal,
	`hip` decimal,
	`thigh` decimal,
	`calf` decimal,
	`waistHipRatio` decimal,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `circumferences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dietTypes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`isDefault` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dietTypes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `diets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`dietTypeId` int NOT NULL,
	`startDate` datetime NOT NULL,
	`endDate` datetime,
	`totalCalories` int,
	`protein` decimal,
	`carbohydrate` decimal,
	`fat` decimal,
	`fiber` decimal,
	`water` decimal,
	`notes` text,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `diets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evaluationPhotos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evaluationId` int NOT NULL,
	`position` enum('front','side','back') NOT NULL,
	`photoUrl` varchar(500) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evaluationPhotos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evolutions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`date` datetime NOT NULL,
	`weight` decimal,
	`bodyFatPercentage` decimal,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evolutions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`muscleGroup` varchar(100) NOT NULL,
	`description` text,
	`imageUrl` varchar(500),
	`videoUrl` varchar(500),
	`isTemplate` boolean DEFAULT true,
	`professionalId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exercises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `foodSubstitutions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`originalFoodId` int NOT NULL,
	`substituteFoodId` int NOT NULL,
	`macroVariance` decimal,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `foodSubstitutions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `foods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100),
	`unit` varchar(20),
	`caloriesPer100g` decimal,
	`proteinPer100g` decimal,
	`carbohydratePer100g` decimal,
	`fatPer100g` decimal,
	`fiberPer100g` decimal,
	`isCustom` boolean DEFAULT false,
	`professionalId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `foods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mealItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mealId` int NOT NULL,
	`foodId` int NOT NULL,
	`quantity` decimal NOT NULL,
	`unit` varchar(20),
	`calories` int,
	`protein` decimal,
	`carbohydrate` decimal,
	`fat` decimal,
	`fiber` decimal,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mealItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dietId` int NOT NULL,
	`mealType` enum('breakfast','snack','lunch','pre_workout','post_workout','dinner','supper') NOT NULL,
	`calories` int,
	`protein` decimal,
	`carbohydrate` decimal,
	`fat` decimal,
	`fiber` decimal,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `meals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nutritionalAssessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`assessmentDate` datetime NOT NULL,
	`basalMetabolicRate` int,
	`totalEnergyExpenditure` int,
	`activityFactor` decimal,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `nutritionalAssessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `physicalEvaluations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`evaluationDate` datetime NOT NULL,
	`weight` decimal,
	`height` decimal,
	`imc` decimal,
	`postureNotes` text,
	`postureAlerts` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `physicalEvaluations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `professionals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('personal_trainer','nutritionist','both') NOT NULL,
	`specialization` text,
	`licenseNumber` varchar(100),
	`phone` varchar(20),
	`bio` text,
	`profileImage` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `professionals_id` PRIMARY KEY(`id`),
	CONSTRAINT `professionals_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `recipeIngredients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipeId` int NOT NULL,
	`foodId` int NOT NULL,
	`quantity` decimal NOT NULL,
	`unit` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recipeIngredients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`dietTypeId` int,
	`description` text,
	`servings` int,
	`prepTime` int,
	`cookTime` int,
	`instructions` text,
	`caloriesPerServing` int,
	`proteinPerServing` decimal,
	`carbohydratePerServing` decimal,
	`fatPerServing` decimal,
	`fiberPerServing` decimal,
	`imageUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recipes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skinFolds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evaluationId` int NOT NULL,
	`protocol` enum('pollock_3','pollock_7','pollock_9','jackson_pollock','guedes') NOT NULL,
	`triceps` decimal,
	`biceps` decimal,
	`subscapular` decimal,
	`suprailiac` decimal,
	`axillary` decimal,
	`pectoral` decimal,
	`abdominal` decimal,
	`thigh` decimal,
	`calf` decimal,
	`bodyFatPercentage` decimal,
	`leanMass` decimal,
	`fatMass` decimal,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `skinFolds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cpf` varchar(11) NOT NULL,
	`name` text NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`dateOfBirth` datetime,
	`gender` enum('male','female','other'),
	`professionalId` int NOT NULL,
	`objective` text,
	`medicalHistory` text,
	`allergies` text,
	`intolerances` text,
	`medications` text,
	`dailyRoutine` text,
	`foodPreferences` text,
	`activityLevel` enum('sedentary','light','moderate','active','very_active'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `students_id` PRIMARY KEY(`id`),
	CONSTRAINT `students_cpf_unique` UNIQUE(`cpf`)
);
--> statement-breakpoint
CREATE TABLE `workoutExercises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workoutId` int NOT NULL,
	`exerciseId` int NOT NULL,
	`order` int,
	`sets` int,
	`reps` varchar(50),
	`load` varchar(50),
	`tempo` varchar(50),
	`rest` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workoutExercises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workoutTypes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workoutTypes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`workoutTypeId` int NOT NULL,
	`division` varchar(10),
	`frequency` int,
	`cycleObjective` varchar(100),
	`cycleDuration` int,
	`startDate` datetime NOT NULL,
	`endDate` datetime,
	`progressionType` enum('linear','undulating','autoregulated','manual') DEFAULT 'manual',
	`notes` text,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','professional','student') NOT NULL DEFAULT 'user';