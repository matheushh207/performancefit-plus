CREATE TABLE `workoutExercises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workoutId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`sets` varchar(50) NOT NULL,
	`reps` varchar(50) NOT NULL,
	`equipment` varchar(100),
	`order` int DEFAULT 0,
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `workoutExercises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `workoutExercises` ADD CONSTRAINT `workoutExercises_workoutId_workouts_id_fk` FOREIGN KEY (`workoutId`) REFERENCES `workouts`(`id`) ON DELETE cascade ON UPDATE no action;