CREATE TABLE "url_analytics" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "url_analytics_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"url_id" integer NOT NULL,
	"clicked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_hash" varchar(64),
	"country" varchar(100),
	"region" varchar(100),
	"device_type" varchar(50),
	"os" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "url_utms" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "url_utms_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"url_id" integer NOT NULL,
	"utm_source" varchar(255),
	"utm_medium" varchar(255),
	"utm_campaign" varchar(255),
	"utm_term" varchar(255),
	"utm_content" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "url_utms_url_id_unique" UNIQUE("url_id")
);
--> statement-breakpoint
ALTER TABLE "url_analytics" ADD CONSTRAINT "url_analytics_url_id_urls_id_fk" FOREIGN KEY ("url_id") REFERENCES "public"."urls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "url_utms" ADD CONSTRAINT "url_utms_url_id_urls_id_fk" FOREIGN KEY ("url_id") REFERENCES "public"."urls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "url_analytics_url_id_idx" ON "url_analytics" USING btree ("url_id");--> statement-breakpoint
CREATE INDEX "url_analytics_clicked_at_idx" ON "url_analytics" USING btree ("clicked_at");--> statement-breakpoint
CREATE INDEX "url_utms_url_id_idx" ON "url_utms" USING btree ("url_id");