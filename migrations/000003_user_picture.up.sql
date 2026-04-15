CREATE TABLE IF NOT EXISTS "USER_PICTURE"(
    "id" SERIAL PRIMARY KEY,
    "user_id" INT,
    "path" VARCHAR(255),

    CONSTRAINT fk_user
        FOREIGN KEY("user_id")
        REFERENCES "USER"("id")
);