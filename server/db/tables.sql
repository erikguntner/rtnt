CREATE TABLE "users" (
	"id" serial NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"username" varchar(255) NOT NULL UNIQUE,
	"password" varchar NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "routes" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"image" varchar(255) NOT NULL,
	"user_id" int NOT NULL,
	"lines" jsonb NOT NULL,
	"elevation_data" jsonb NOT NULL,
	"points" jsonb NOT NULL,
	"total_distance" jsonb NOT NULL,
	CONSTRAINT "routes_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "routes" ADD CONSTRAINT "routes_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");