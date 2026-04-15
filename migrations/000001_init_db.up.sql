CREATE TABLE IF NOT EXISTS "USER"(
    "id" SERIAL PRIMARY KEY,
    "fullname" VARCHAR(255),
    "email" VARCHAR(255),
    "password" VARCHAR(255),
    "role" VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS "PRODUCT"(
    "id" SERIAL PRIMARY KEY,
    "product_name" VARCHAR(50),
    "product_desc" VARCHAR(255),
    "price" INT NOT NULL,
    "stock" INT 
);

CREATE TABLE IF NOT EXISTS "VARIANT"(
    "id" SERIAL PRIMARY KEY,
    "variant" VARCHAR(50),
    "add_price" INT
);
CREATE TABLE IF NOT EXISTS "PRODUCT_VARIANT"(
    "id" SERIAL PRIMARY KEY,
    "product_id" INT,
    "variant_id" INT,

    CONSTRAINT fk_product
        FOREIGN KEY("product_id")
        REFERENCES "PRODUCT"("id"),
    CONSTRAINT fk_category
        FOREIGN KEY("variant_id")
        REFERENCES "VARIANT"("id")
);

CREATE TABLE IF NOT EXISTS "SIZE"(
    "id" SERIAL PRIMARY KEY,
    "size" VARCHAR(50),
    "add_price" INT
);
CREATE TABLE IF NOT EXISTS "PRODUCT_SIZE"(
    "id" SERIAL PRIMARY KEY,
    "product_id" INT,
    "size_id" INT,

    CONSTRAINT fk_product
        FOREIGN KEY("product_id")
        REFERENCES "PRODUCT"("id"),
    CONSTRAINT fk_category
        FOREIGN KEY("size_id")
        REFERENCES "SIZE"("id")
);

CREATE TABLE IF NOT EXISTS "PRODUCT_IMAGES"(
    "id" SERIAL PRIMARY KEY,
    "path" VARCHAR(255),
    "product_id" INT,

    CONSTRAINT fk_product
        FOREIGN KEY ("product_id")
        REFERENCES "PRODUCT"("id")
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS "CATEGORY"(
    "id" SERIAL PRIMARY KEY,
    "category" VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS "PRODUCT_CATEGORY"(
    "id" SERIAL PRIMARY KEY,
    "product_id" INT,
    "category_id" INT,

    CONSTRAINT fk_product
        FOREIGN KEY("product_id")
        REFERENCES "PRODUCT"("id"),
    CONSTRAINT fk_category
        FOREIGN KEY("category_id")
        REFERENCES "CATEGORY"("id")
);

CREATE TABLE IF NOT EXISTS "DISCOUNT"(
    "id" SERIAL PRIMARY KEY,
    "discount_rate" FLOAT,
    "description" VARCHAR(255),
    "is_flashsale" BOOLEAN
);
CREATE TABLE IF NOT EXISTS "PRODUCT_DISCOUNT"(
    "id" SERIAL PRIMARY KEY,
    "product_id" INT,
    "discount_id" INT,

    CONSTRAINT fk_product
        FOREIGN KEY ("product_id")
        REFERENCES "PRODUCT"("id"),
    CONSTRAINT fk_discount
        FOREIGN KEY ("discount_id")
        REFERENCES "DISCOUNT"("id")
);

CREATE TABLE IF NOT EXISTS "REVIEWS"(
    "id" SERIAL PRIMARY KEY,
    "user_id" INT,
    "product_id" INT,
    "messages" VARCHAR(255),
    "rating" INT,

    CONSTRAINT fk_user
        FOREIGN KEY ("user_id")
        REFERENCES "USER"("id"),
    CONSTRAINT fk_product
        FOREIGN KEY ("product_id")
        REFERENCES "PRODUCT"("id")
);

CREATE TABLE IF NOT EXISTS "CART"(
    "id" SERIAL PRIMARY KEY,
    "quantity" INT NOT NULL,
    "size" VARCHAR(10),
    "variant" VARCHAR(50),
    "user_id" INT,
    "product_id" INT,

    CONSTRAINT fk_user
        FOREIGN KEY("user_id")
        REFERENCES "USER"("id"),

    CONSTRAINT fk_product
        FOREIGN KEY("product_id")
        REFERENCES "PRODUCT"("id")

);

CREATE TABLE IF NOT EXISTS "TRANSACTION"(
    "id" SERIAL PRIMARY KEY,
    "trx_id" VARCHAR(255),
    "user_id" INT,
    "order_date" TIMESTAMP DEFAULT NOW(),
    "fullname" VARCHAR(255),
    "email" VARCHAR(50),
    "address" VARCHAR(255),
    "delivery" VARCHAR(50),
    "delivery_fee" INT,
    "tax" INT,
    "total" INT,
    "status_order" VARCHAR(10),

CONSTRAINT fk_user
        FOREIGN KEY("user_id")
        REFERENCES "USER"("id")

);

CREATE TABLE IF NOT EXISTS "TRANSACTION_PRODUCT"(
    "id" SERIAL PRIMARY KEY,
    "transaction_id" INT,
    "product_id" INT,
    "quantity" INT NOT NULL,
    "size" VARCHAR(10),
    "variant" VARCHAR(50),

    CONSTRAINT fk_transaction
        FOREIGN KEY("transaction_id")
        REFERENCES "TRANSACTION"("id"),

    CONSTRAINT fk_product
        FOREIGN KEY("product_id")
        REFERENCES "PRODUCT"("id")

);