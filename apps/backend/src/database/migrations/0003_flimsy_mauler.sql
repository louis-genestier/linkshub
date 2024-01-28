DROP TABLE `user_key`;--> statement-breakpoint
ALTER TABLE user ADD `hashed_password` text NOT NULL;--> statement-breakpoint
ALTER TABLE user_session ADD `expires_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `user_session` DROP COLUMN `active_expires`;--> statement-breakpoint
ALTER TABLE `user_session` DROP COLUMN `idle_expires`;