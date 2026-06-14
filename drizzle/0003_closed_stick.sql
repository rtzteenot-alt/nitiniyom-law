CREATE TABLE `tools_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`usageId` int NOT NULL,
	`userId` int NOT NULL,
	`toolType` enum('time_calculator','interest_calculator','contract_template','legal_calculator') NOT NULL,
	`inputData` text,
	`resultData` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tools_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tools_usage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`toolType` enum('time_calculator','interest_calculator','contract_template','legal_calculator') NOT NULL,
	`toolName` varchar(255) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tools_usage_id` PRIMARY KEY(`id`)
);
