CREATE TABLE "address_clusters" (
	"id" text PRIMARY KEY NOT NULL,
	"address_line_1" text NOT NULL,
	"address_line_2" text,
	"locality" text NOT NULL,
	"postal_code" text NOT NULL,
	"country" text NOT NULL,
	"standardized_address" text,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"cluster_id" text,
	"cluster_size" integer DEFAULT 1,
	"companies_count" integer DEFAULT 0,
	"directors_count" integer DEFAULT 0,
	"risk_score" integer DEFAULT 0,
	"suspicious_activity_flags" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_relationships" (
	"id" text PRIMARY KEY NOT NULL,
	"entity_type_1" text NOT NULL,
	"entity_id_1" text NOT NULL,
	"entity_type_2" text NOT NULL,
	"entity_id_2" text NOT NULL,
	"relationship_type" text NOT NULL,
	"relationship_strength" numeric(3, 2),
	"connection_degree" integer DEFAULT 1,
	"path_length" integer DEFAULT 1,
	"clustering_coefficient" numeric(4, 3),
	"relationship_start" timestamp,
	"relationship_end" timestamp,
	"is_active" boolean DEFAULT true,
	"risk_flag" boolean DEFAULT false,
	"risk_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"company_number" text NOT NULL,
	"company_name" text NOT NULL,
	"company_status" text NOT NULL,
	"company_type" text NOT NULL,
	"incorporation_date" timestamp,
	"dissolved_date" timestamp,
	"registered_address" json,
	"sic_codes" json,
	"risk_score" integer,
	"compliance_score" integer,
	"last_analyzed" timestamp,
	"raw_data" json,
	"officers_data" json,
	"filing_history_data" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "company_profiles_company_number_unique" UNIQUE("company_number")
);
--> statement-breakpoint
CREATE TABLE "director_appointments" (
	"id" text PRIMARY KEY NOT NULL,
	"director_id" text NOT NULL,
	"company_number" text NOT NULL,
	"officer_role" text NOT NULL,
	"appointed_on" timestamp,
	"resigned_on" timestamp,
	"appointment_status" text NOT NULL,
	"responsibility_level" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "directors" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"title" text,
	"date_of_birth" text,
	"nationality" text,
	"occupation" text,
	"address_line_1" text,
	"address_line_2" text,
	"locality" text,
	"postal_code" text,
	"country" text,
	"risk_flags" json,
	"total_appointments" integer DEFAULT 0,
	"active_appointments" integer DEFAULT 0,
	"disqualifications" json,
	"first_seen" timestamp DEFAULT now() NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "network_analysis_cache" (
	"id" text PRIMARY KEY NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"analysis_type" text NOT NULL,
	"depth" integer DEFAULT 2,
	"relationship_types" json,
	"filters" json,
	"network_data" json,
	"metrics" json,
	"visualization" json,
	"compute_time" integer,
	"node_count" integer,
	"edge_count" integer,
	"access_count" integer DEFAULT 0,
	"last_accessed" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ownership_structure" (
	"id" text PRIMARY KEY NOT NULL,
	"shareholder_id" text NOT NULL,
	"company_number" text NOT NULL,
	"share_class" text,
	"shares_held" text,
	"percentage_held" numeric(5, 2),
	"voting_rights" numeric(5, 2),
	"is_beneficial_owner" boolean DEFAULT false,
	"beneficial_ownership_chain" json,
	"ownership_date" timestamp,
	"notified_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shareholders" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"shareholder_type" text NOT NULL,
	"company_number" text,
	"nationality" text,
	"first_seen" timestamp DEFAULT now() NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_activity" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"activity_type" text NOT NULL,
	"entity_type" text,
	"entity_id" text,
	"data_accessed" json,
	"legal_basis" text,
	"purpose" text,
	"ip_address" text,
	"user_agent" text,
	"session_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "director_appointments" ADD CONSTRAINT "director_appointments_director_id_directors_id_fk" FOREIGN KEY ("director_id") REFERENCES "public"."directors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ownership_structure" ADD CONSTRAINT "ownership_structure_shareholder_id_shareholders_id_fk" FOREIGN KEY ("shareholder_id") REFERENCES "public"."shareholders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "postal_code_idx" ON "address_clusters" USING btree ("postal_code");--> statement-breakpoint
CREATE INDEX "cluster_id_idx" ON "address_clusters" USING btree ("cluster_id");--> statement-breakpoint
CREATE INDEX "location_idx" ON "address_clusters" USING btree ("latitude","longitude");--> statement-breakpoint
CREATE INDEX "entity1_idx" ON "business_relationships" USING btree ("entity_type_1","entity_id_1");--> statement-breakpoint
CREATE INDEX "entity2_idx" ON "business_relationships" USING btree ("entity_type_2","entity_id_2");--> statement-breakpoint
CREATE INDEX "relationship_type_idx" ON "business_relationships" USING btree ("relationship_type");--> statement-breakpoint
CREATE INDEX "active_relationships_idx" ON "business_relationships" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "risk_flag_idx" ON "business_relationships" USING btree ("risk_flag");--> statement-breakpoint
CREATE INDEX "company_number_idx" ON "company_profiles" USING btree ("company_number");--> statement-breakpoint
CREATE INDEX "company_name_idx" ON "company_profiles" USING btree ("company_name");--> statement-breakpoint
CREATE INDEX "company_status_idx" ON "company_profiles" USING btree ("company_status");--> statement-breakpoint
CREATE INDEX "director_company_idx" ON "director_appointments" USING btree ("director_id","company_number");--> statement-breakpoint
CREATE INDEX "appointment_company_idx" ON "director_appointments" USING btree ("company_number");--> statement-breakpoint
CREATE INDEX "appointment_status_idx" ON "director_appointments" USING btree ("appointment_status");--> statement-breakpoint
CREATE INDEX "director_name_idx" ON "directors" USING btree ("name");--> statement-breakpoint
CREATE INDEX "director_postal_code_idx" ON "directors" USING btree ("postal_code");--> statement-breakpoint
CREATE INDEX "entity_analysis_idx" ON "network_analysis_cache" USING btree ("entity_type","entity_id","analysis_type");--> statement-breakpoint
CREATE INDEX "expires_at_idx" ON "network_analysis_cache" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "last_accessed_idx" ON "network_analysis_cache" USING btree ("last_accessed");--> statement-breakpoint
CREATE INDEX "shareholder_company_idx" ON "ownership_structure" USING btree ("shareholder_id","company_number");--> statement-breakpoint
CREATE INDEX "ownership_company_idx" ON "ownership_structure" USING btree ("company_number");--> statement-breakpoint
CREATE INDEX "beneficial_owner_idx" ON "ownership_structure" USING btree ("is_beneficial_owner");--> statement-breakpoint
CREATE INDEX "shareholder_name_idx" ON "shareholders" USING btree ("name");--> statement-breakpoint
CREATE INDEX "shareholder_type_idx" ON "shareholders" USING btree ("shareholder_type");--> statement-breakpoint
CREATE INDEX "user_activity_idx" ON "user_activity" USING btree ("user_id","activity_type");--> statement-breakpoint
CREATE INDEX "activity_entity_idx" ON "user_activity" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "activity_created_at_idx" ON "user_activity" USING btree ("created_at");