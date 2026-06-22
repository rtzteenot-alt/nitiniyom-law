CREATE TABLE `api_usage_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`endpoint` varchar(255) NOT NULL,
	`method` varchar(20) NOT NULL,
	`status` int,
	`responseTime` int,
	`tokensUsed` int DEFAULT 0,
	`model` varchar(100),
	`userId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `api_usage_logs_id` PRIMARY KEY(`id`)
);
