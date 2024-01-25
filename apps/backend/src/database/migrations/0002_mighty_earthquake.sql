CREATE TABLE `bookmark` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`title` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`update_at` text DEFAULT CURRENT_TIMESTAMP,
	`user_id` text NOT NULL
);
