CREATE TABLE `bioimpedanceData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evaluationId` int NOT NULL,
	`bodyFatPercentage` decimal(5,2),
	`leanMassPercentage` decimal(5,2),
	`bodyWaterPercentage` decimal(5,2),
	`boneMass` decimal(6,2),
	`visceralFat` decimal(5,2),
	`basalMetabolism` decimal(8,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bioimpedanceData_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `insights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`professionalId` int NOT NULL,
	`type` enum('stagnation','inconsistency','overload','aggressive_deficit','suggestion') NOT NULL,
	`title` varchar(100) NOT NULL,
	`description` text,
	`severity` enum('low','medium','high') DEFAULT 'medium',
	`isResolved` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`resolvedAt` datetime,
	CONSTRAINT `insights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mealFoods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mealId` int NOT NULL,
	`foodId` int NOT NULL,
	`quantity` decimal(8,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mealFoods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `alerts`;--> statement-breakpoint
DROP TABLE `bioimpedance`;--> statement-breakpoint
DROP TABLE `dietTypes`;--> statement-breakpoint
DROP TABLE `evolutions`;--> statement-breakpoint
DROP TABLE `foodSubstitutions`;--> statement-breakpoint
DROP TABLE `mealItems`;--> statement-breakpoint
DROP TABLE `workoutExercises`;--> statement-breakpoint
DROP TABLE `workoutTypes`;--> statement-breakpoint
ALTER TABLE `professionalSubscriptions` DROP INDEX `professionalSubscriptions_professionalId_unique`;--> statement-breakpoint
ALTER TABLE `circumferences` MODIFY COLUMN `neck` decimal(6,2);--> statement-breakpoint
ALTER TABLE `circumferences` MODIFY COLUMN `shoulder` decimal(6,2);--> statement-breakpoint
ALTER TABLE `circumferences` MODIFY COLUMN `chest` decimal(6,2);--> statement-breakpoint
ALTER TABLE `circumferences` MODIFY COLUMN `relaxedArm` decimal(6,2);--> statement-breakpoint
ALTER TABLE `circumferences` MODIFY COLUMN `contractedArm` decimal(6,2);--> statement-breakpoint
ALTER TABLE `circumferences` MODIFY COLUMN `forearm` decimal(6,2);--> statement-breakpoint
ALTER TABLE `circumferences` MODIFY COLUMN `waist` decimal(6,2);--> statement-breakpoint
ALTER TABLE `circumferences` MODIFY COLUMN `abdomen` decimal(6,2);--> statement-breakpoint
ALTER TABLE `circumferences` MODIFY COLUMN `hip` decimal(6,2);--> statement-breakpoint
ALTER TABLE `circumferences` MODIFY COLUMN `thigh` decimal(6,2);--> statement-breakpoint
ALTER TABLE `circumferences` MODIFY COLUMN `calf` decimal(6,2);--> statement-breakpoint
ALTER TABLE `circumferences` MODIFY COLUMN `waistHipRatio` decimal(5,2);--> statement-breakpoint
ALTER TABLE `diets` MODIFY COLUMN `startDate` datetime;--> statement-breakpoint
ALTER TABLE `diets` MODIFY COLUMN `totalCalories` decimal(8,2);--> statement-breakpoint
ALTER TABLE `diets` MODIFY COLUMN `protein` decimal(8,2);--> statement-breakpoint
ALTER TABLE `diets` MODIFY COLUMN `fat` decimal(8,2);--> statement-breakpoint
ALTER TABLE `diets` MODIFY COLUMN `fiber` decimal(8,2);--> statement-breakpoint
ALTER TABLE `diets` MODIFY COLUMN `water` decimal(8,2);--> statement-breakpoint
ALTER TABLE `evaluationPhotos` MODIFY COLUMN `photoUrl` text NOT NULL;--> statement-breakpoint
ALTER TABLE `exercises` MODIFY COLUMN `name` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `exercises` MODIFY COLUMN `muscleGroup` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `foods` MODIFY COLUMN `name` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `nutritionalAssessments` MODIFY COLUMN `basalMetabolicRate` decimal(8,2);--> statement-breakpoint
ALTER TABLE `nutritionalAssessments` MODIFY COLUMN `totalEnergyExpenditure` decimal(8,2);--> statement-breakpoint
ALTER TABLE `payments` MODIFY COLUMN `amount` decimal(10,2);--> statement-breakpoint
ALTER TABLE `physicalEvaluations` MODIFY COLUMN `weight` decimal(6,2);--> statement-breakpoint
ALTER TABLE `physicalEvaluations` MODIFY COLUMN `height` decimal(5,2);--> statement-breakpoint
ALTER TABLE `physicalEvaluations` MODIFY COLUMN `imc` decimal(5,2);--> statement-breakpoint
ALTER TABLE `professionals` MODIFY COLUMN `userId` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `recipeIngredients` MODIFY COLUMN `quantity` decimal(8,2);--> statement-breakpoint
ALTER TABLE `recipes` MODIFY COLUMN `name` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `recipes` MODIFY COLUMN `imageUrl` text;--> statement-breakpoint
ALTER TABLE `skinFolds` MODIFY COLUMN `protocol` varchar(50);--> statement-breakpoint
ALTER TABLE `skinFolds` MODIFY COLUMN `triceps` decimal(5,2);--> statement-breakpoint
ALTER TABLE `skinFolds` MODIFY COLUMN `biceps` decimal(5,2);--> statement-breakpoint
ALTER TABLE `skinFolds` MODIFY COLUMN `subscapular` decimal(5,2);--> statement-breakpoint
ALTER TABLE `skinFolds` MODIFY COLUMN `suprailiac` decimal(5,2);--> statement-breakpoint
ALTER TABLE `skinFolds` MODIFY COLUMN `axillary` decimal(5,2);--> statement-breakpoint
ALTER TABLE `skinFolds` MODIFY COLUMN `pectoral` decimal(5,2);--> statement-breakpoint
ALTER TABLE `skinFolds` MODIFY COLUMN `abdominal` decimal(5,2);--> statement-breakpoint
ALTER TABLE `skinFolds` MODIFY COLUMN `thigh` decimal(5,2);--> statement-breakpoint
ALTER TABLE `skinFolds` MODIFY COLUMN `calf` decimal(5,2);--> statement-breakpoint
ALTER TABLE `students` MODIFY COLUMN `cpf` varchar(14) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptionPlans` MODIFY COLUMN `monthlyPrice` decimal(10,2);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `workouts` MODIFY COLUMN `name` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `workouts` MODIFY COLUMN `startDate` datetime;--> statement-breakpoint
ALTER TABLE `appointments` ADD `appointmentDate` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `appointments` ADD `type` enum('evaluation','followup','assessment','other') NOT NULL;--> statement-breakpoint
ALTER TABLE `appointments` ADD `isCompleted` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `diets` ADD `professionalId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `diets` ADD `name` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `diets` ADD `type` enum('weight_loss','hypertrophy','maintenance','low_carb','ketogenic','vegetarian','vegan','flexible','clinical') NOT NULL;--> statement-breakpoint
ALTER TABLE `diets` ADD `carbohydrates` decimal(8,2);--> statement-breakpoint
ALTER TABLE `evaluationPhotos` ADD `angle` enum('front','side','back') NOT NULL;--> statement-breakpoint
ALTER TABLE `evaluationPhotos` ADD `uploadedAt` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `exercises` ADD `workoutId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `exercises` ADD `sets` int;--> statement-breakpoint
ALTER TABLE `exercises` ADD `reps` varchar(50);--> statement-breakpoint
ALTER TABLE `exercises` ADD `load` decimal(8,2);--> statement-breakpoint
ALTER TABLE `exercises` ADD `duration` int;--> statement-breakpoint
ALTER TABLE `exercises` ADD `restInterval` int;--> statement-breakpoint
ALTER TABLE `exercises` ADD `notes` text;--> statement-breakpoint
ALTER TABLE `exercises` ADD `order` int;--> statement-breakpoint
ALTER TABLE `foods` ADD `portion` decimal(8,2);--> statement-breakpoint
ALTER TABLE `foods` ADD `portionUnit` varchar(20);--> statement-breakpoint
ALTER TABLE `foods` ADD `calories` decimal(8,2);--> statement-breakpoint
ALTER TABLE `foods` ADD `protein` decimal(8,2);--> statement-breakpoint
ALTER TABLE `foods` ADD `carbohydrates` decimal(8,2);--> statement-breakpoint
ALTER TABLE `foods` ADD `fat` decimal(8,2);--> statement-breakpoint
ALTER TABLE `foods` ADD `fiber` decimal(8,2);--> statement-breakpoint
ALTER TABLE `foods` ADD `source` varchar(50);--> statement-breakpoint
ALTER TABLE `meals` ADD `targetCalories` decimal(8,2);--> statement-breakpoint
ALTER TABLE `meals` ADD `targetProtein` decimal(8,2);--> statement-breakpoint
ALTER TABLE `meals` ADD `targetCarbs` decimal(8,2);--> statement-breakpoint
ALTER TABLE `meals` ADD `targetFat` decimal(8,2);--> statement-breakpoint
ALTER TABLE `meals` ADD `order` int;--> statement-breakpoint
ALTER TABLE `nutritionalAssessments` ADD `professionalId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `nutritionalAssessments` ADD `medicalHistory` text;--> statement-breakpoint
ALTER TABLE `nutritionalAssessments` ADD `allergies` text;--> statement-breakpoint
ALTER TABLE `nutritionalAssessments` ADD `intolerances` text;--> statement-breakpoint
ALTER TABLE `nutritionalAssessments` ADD `medications` text;--> statement-breakpoint
ALTER TABLE `nutritionalAssessments` ADD `dailyRoutine` text;--> statement-breakpoint
ALTER TABLE `nutritionalAssessments` ADD `foodPreferences` text;--> statement-breakpoint
ALTER TABLE `nutritionalAssessments` ADD `activityLevel` varchar(50);--> statement-breakpoint
ALTER TABLE `physicalEvaluations` ADD `bodyFatPercentage` decimal(5,2);--> statement-breakpoint
ALTER TABLE `physicalEvaluations` ADD `leanMass` decimal(6,2);--> statement-breakpoint
ALTER TABLE `physicalEvaluations` ADD `fatMass` decimal(6,2);--> statement-breakpoint
ALTER TABLE `physicalEvaluations` ADD `observations` text;--> statement-breakpoint
ALTER TABLE `professionals` ADD `fullName` text NOT NULL;--> statement-breakpoint
ALTER TABLE `professionals` ADD `email` varchar(320) NOT NULL;--> statement-breakpoint
ALTER TABLE `professionals` ADD `cpf` varchar(14) NOT NULL;--> statement-breakpoint
ALTER TABLE `professionals` ADD `isActive` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `professionals` ADD `passwordHash` varchar(255);--> statement-breakpoint
ALTER TABLE `recipes` ADD `dietType` enum('weight_loss','hypertrophy','maintenance','low_carb','ketogenic','vegetarian','vegan','flexible') NOT NULL;--> statement-breakpoint
ALTER TABLE `recipes` ADD `totalCalories` decimal(8,2);--> statement-breakpoint
ALTER TABLE `recipes` ADD `totalProtein` decimal(8,2);--> statement-breakpoint
ALTER TABLE `recipes` ADD `totalCarbs` decimal(8,2);--> statement-breakpoint
ALTER TABLE `recipes` ADD `totalFat` decimal(8,2);--> statement-breakpoint
ALTER TABLE `recipes` ADD `totalFiber` decimal(8,2);--> statement-breakpoint
ALTER TABLE `students` ADD `fullName` text NOT NULL;--> statement-breakpoint
ALTER TABLE `students` ADD `birthDate` date;--> statement-breakpoint
ALTER TABLE `students` ADD `notes` text;--> statement-breakpoint
ALTER TABLE `students` ADD `isActive` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `workouts` ADD `professionalId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `workouts` ADD `type` enum('hypertrophy','strength','resistance','weight_loss','functional','rehabilitation','hiit','cardio') NOT NULL;--> statement-breakpoint
ALTER TABLE `workouts` ADD `objective` text;--> statement-breakpoint
ALTER TABLE `professionals` ADD CONSTRAINT `professionals_cpf_unique` UNIQUE(`cpf`);--> statement-breakpoint
ALTER TABLE `bioimpedanceData` ADD CONSTRAINT `bioimpedanceData_evaluationId_physicalEvaluations_id_fk` FOREIGN KEY (`evaluationId`) REFERENCES `physicalEvaluations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `insights` ADD CONSTRAINT `insights_studentId_students_id_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `insights` ADD CONSTRAINT `insights_professionalId_professionals_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `professionals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mealFoods` ADD CONSTRAINT `mealFoods_mealId_meals_id_fk` FOREIGN KEY (`mealId`) REFERENCES `meals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mealFoods` ADD CONSTRAINT `mealFoods_foodId_foods_id_fk` FOREIGN KEY (`foodId`) REFERENCES `foods`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `insights_studentId_idx` ON `insights` (`studentId`);--> statement-breakpoint
CREATE INDEX `insights_professionalId_idx` ON `insights` (`professionalId`);--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_professionalId_professionals_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `professionals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_studentId_students_id_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `circumferences` ADD CONSTRAINT `circumferences_evaluationId_physicalEvaluations_id_fk` FOREIGN KEY (`evaluationId`) REFERENCES `physicalEvaluations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `diets` ADD CONSTRAINT `diets_studentId_students_id_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `diets` ADD CONSTRAINT `diets_professionalId_professionals_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `professionals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `evaluationPhotos` ADD CONSTRAINT `evaluationPhotos_evaluationId_physicalEvaluations_id_fk` FOREIGN KEY (`evaluationId`) REFERENCES `physicalEvaluations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `exercises` ADD CONSTRAINT `exercises_workoutId_workouts_id_fk` FOREIGN KEY (`workoutId`) REFERENCES `workouts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meals` ADD CONSTRAINT `meals_dietId_diets_id_fk` FOREIGN KEY (`dietId`) REFERENCES `diets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nutritionalAssessments` ADD CONSTRAINT `nutritionalAssessments_studentId_students_id_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nutritionalAssessments` ADD CONSTRAINT `nutritionalAssessments_professionalId_professionals_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `professionals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_subscriptionId_professionalSubscriptions_id_fk` FOREIGN KEY (`subscriptionId`) REFERENCES `professionalSubscriptions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `physicalEvaluations` ADD CONSTRAINT `physicalEvaluations_studentId_students_id_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `professionalSubscriptions` ADD CONSTRAINT `professionalSubscriptions_professionalId_professionals_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `professionals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `professionalSubscriptions` ADD CONSTRAINT `professionalSubscriptions_planId_subscriptionPlans_id_fk` FOREIGN KEY (`planId`) REFERENCES `subscriptionPlans`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `professionals` ADD CONSTRAINT `professionals_userId_users_openId_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`openId`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recipeIngredients` ADD CONSTRAINT `recipeIngredients_recipeId_recipes_id_fk` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recipeIngredients` ADD CONSTRAINT `recipeIngredients_foodId_foods_id_fk` FOREIGN KEY (`foodId`) REFERENCES `foods`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `skinFolds` ADD CONSTRAINT `skinFolds_evaluationId_physicalEvaluations_id_fk` FOREIGN KEY (`evaluationId`) REFERENCES `physicalEvaluations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `students` ADD CONSTRAINT `students_professionalId_professionals_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `professionals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workouts` ADD CONSTRAINT `workouts_studentId_students_id_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workouts` ADD CONSTRAINT `workouts_professionalId_professionals_id_fk` FOREIGN KEY (`professionalId`) REFERENCES `professionals`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `appointments_professionalId_idx` ON `appointments` (`professionalId`);--> statement-breakpoint
CREATE INDEX `appointments_studentId_idx` ON `appointments` (`studentId`);--> statement-breakpoint
CREATE INDEX `appointments_appointmentDate_idx` ON `appointments` (`appointmentDate`);--> statement-breakpoint
CREATE INDEX `diets_studentId_idx` ON `diets` (`studentId`);--> statement-breakpoint
CREATE INDEX `diets_professionalId_idx` ON `diets` (`professionalId`);--> statement-breakpoint
CREATE INDEX `payments_subscriptionId_idx` ON `payments` (`subscriptionId`);--> statement-breakpoint
CREATE INDEX `physicalEvaluations_studentId_idx` ON `physicalEvaluations` (`studentId`);--> statement-breakpoint
CREATE INDEX `professionalSubscriptions_professionalId_idx` ON `professionalSubscriptions` (`professionalId`);--> statement-breakpoint
CREATE INDEX `professionalSubscriptions_status_idx` ON `professionalSubscriptions` (`status`);--> statement-breakpoint
CREATE INDEX `students_professionalId_idx` ON `students` (`professionalId`);--> statement-breakpoint
CREATE INDEX `students_cpf_idx` ON `students` (`cpf`);--> statement-breakpoint
CREATE INDEX `workouts_studentId_idx` ON `workouts` (`studentId`);--> statement-breakpoint
CREATE INDEX `workouts_professionalId_idx` ON `workouts` (`professionalId`);--> statement-breakpoint
ALTER TABLE `appointments` DROP COLUMN `appointmentType`;--> statement-breakpoint
ALTER TABLE `appointments` DROP COLUMN `scheduledDate`;--> statement-breakpoint
ALTER TABLE `appointments` DROP COLUMN `duration`;--> statement-breakpoint
ALTER TABLE `appointments` DROP COLUMN `completed`;--> statement-breakpoint
ALTER TABLE `appointments` DROP COLUMN `updatedAt`;--> statement-breakpoint
ALTER TABLE `diets` DROP COLUMN `dietTypeId`;--> statement-breakpoint
ALTER TABLE `diets` DROP COLUMN `carbohydrate`;--> statement-breakpoint
ALTER TABLE `evaluationPhotos` DROP COLUMN `position`;--> statement-breakpoint
ALTER TABLE `evaluationPhotos` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `exercises` DROP COLUMN `description`;--> statement-breakpoint
ALTER TABLE `exercises` DROP COLUMN `imageUrl`;--> statement-breakpoint
ALTER TABLE `exercises` DROP COLUMN `videoUrl`;--> statement-breakpoint
ALTER TABLE `exercises` DROP COLUMN `isTemplate`;--> statement-breakpoint
ALTER TABLE `exercises` DROP COLUMN `professionalId`;--> statement-breakpoint
ALTER TABLE `foods` DROP COLUMN `category`;--> statement-breakpoint
ALTER TABLE `foods` DROP COLUMN `unit`;--> statement-breakpoint
ALTER TABLE `foods` DROP COLUMN `caloriesPer100g`;--> statement-breakpoint
ALTER TABLE `foods` DROP COLUMN `proteinPer100g`;--> statement-breakpoint
ALTER TABLE `foods` DROP COLUMN `carbohydratePer100g`;--> statement-breakpoint
ALTER TABLE `foods` DROP COLUMN `fatPer100g`;--> statement-breakpoint
ALTER TABLE `foods` DROP COLUMN `fiberPer100g`;--> statement-breakpoint
ALTER TABLE `foods` DROP COLUMN `professionalId`;--> statement-breakpoint
ALTER TABLE `meals` DROP COLUMN `calories`;--> statement-breakpoint
ALTER TABLE `meals` DROP COLUMN `protein`;--> statement-breakpoint
ALTER TABLE `meals` DROP COLUMN `carbohydrate`;--> statement-breakpoint
ALTER TABLE `meals` DROP COLUMN `fat`;--> statement-breakpoint
ALTER TABLE `meals` DROP COLUMN `fiber`;--> statement-breakpoint
ALTER TABLE `meals` DROP COLUMN `updatedAt`;--> statement-breakpoint
ALTER TABLE `nutritionalAssessments` DROP COLUMN `activityFactor`;--> statement-breakpoint
ALTER TABLE `physicalEvaluations` DROP COLUMN `postureAlerts`;--> statement-breakpoint
ALTER TABLE `physicalEvaluations` DROP COLUMN `updatedAt`;--> statement-breakpoint
ALTER TABLE `professionals` DROP COLUMN `bio`;--> statement-breakpoint
ALTER TABLE `professionals` DROP COLUMN `profileImage`;--> statement-breakpoint
ALTER TABLE `recipes` DROP COLUMN `dietTypeId`;--> statement-breakpoint
ALTER TABLE `recipes` DROP COLUMN `caloriesPerServing`;--> statement-breakpoint
ALTER TABLE `recipes` DROP COLUMN `proteinPerServing`;--> statement-breakpoint
ALTER TABLE `recipes` DROP COLUMN `carbohydratePerServing`;--> statement-breakpoint
ALTER TABLE `recipes` DROP COLUMN `fatPerServing`;--> statement-breakpoint
ALTER TABLE `recipes` DROP COLUMN `fiberPerServing`;--> statement-breakpoint
ALTER TABLE `skinFolds` DROP COLUMN `bodyFatPercentage`;--> statement-breakpoint
ALTER TABLE `skinFolds` DROP COLUMN `leanMass`;--> statement-breakpoint
ALTER TABLE `skinFolds` DROP COLUMN `fatMass`;--> statement-breakpoint
ALTER TABLE `students` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `students` DROP COLUMN `dateOfBirth`;--> statement-breakpoint
ALTER TABLE `students` DROP COLUMN `medicalHistory`;--> statement-breakpoint
ALTER TABLE `students` DROP COLUMN `allergies`;--> statement-breakpoint
ALTER TABLE `students` DROP COLUMN `intolerances`;--> statement-breakpoint
ALTER TABLE `students` DROP COLUMN `medications`;--> statement-breakpoint
ALTER TABLE `students` DROP COLUMN `dailyRoutine`;--> statement-breakpoint
ALTER TABLE `students` DROP COLUMN `foodPreferences`;--> statement-breakpoint
ALTER TABLE `students` DROP COLUMN `activityLevel`;--> statement-breakpoint
ALTER TABLE `workouts` DROP COLUMN `workoutTypeId`;--> statement-breakpoint
ALTER TABLE `workouts` DROP COLUMN `cycleObjective`;