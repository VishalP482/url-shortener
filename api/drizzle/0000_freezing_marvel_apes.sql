CREATE TABLE "urls" (
	"id" serial PRIMARY KEY NOT NULL,
	"short_code" varchar(10) NOT NULL,
	"original_url" varchar(2048) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "urls_short_code_unique" UNIQUE("short_code")
);
