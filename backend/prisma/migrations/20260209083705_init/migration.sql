-- CreateTable
CREATE TABLE "tbl_role_master" (
    "role_id" SERIAL NOT NULL,
    "role_code" VARCHAR(50) NOT NULL,
    "role_desc" VARCHAR(150),
    "role_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_role_master_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "tbl_user_1" (
    "usr_id" UUID NOT NULL,
    "usr_name" VARCHAR(150) NOT NULL,
    "usr_email" VARCHAR(255) NOT NULL,
    "usr_phone" VARCHAR(20),
    "usr_password" TEXT NOT NULL,
    "usr_status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "usr_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "usr_phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "usr_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usr_created_by" UUID,

    CONSTRAINT "tbl_user_1_pkey" PRIMARY KEY ("usr_id")
);

-- CreateTable
CREATE TABLE "tbl_user_2" (
    "usr_id" UUID NOT NULL,
    "usr_address" TEXT,
    "usr_city" VARCHAR(100),
    "usr_state" VARCHAR(100),
    "usr_country" VARCHAR(100),
    "usr_pincode" VARCHAR(20),
    "usr_gender" VARCHAR(20),
    "usr_dob" TIMESTAMP(3),
    "usr_profile_image" TEXT,
    "usr_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usr_created_by" UUID,

    CONSTRAINT "tbl_user_2_pkey" PRIMARY KEY ("usr_id")
);

-- CreateTable
CREATE TABLE "tbl_platform_1" (
    "plt_id" UUID NOT NULL,
    "plt_name" VARCHAR(150) NOT NULL,
    "plt_email" VARCHAR(255) NOT NULL,
    "plt_phone" VARCHAR(20),
    "plt_password" TEXT NOT NULL,
    "plt_status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "plt_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "plt_phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "plt_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plt_created_by" UUID,

    CONSTRAINT "tbl_platform_1_pkey" PRIMARY KEY ("plt_id")
);

-- CreateTable
CREATE TABLE "tbl_platform_2" (
    "plt_id" UUID NOT NULL,
    "plt_address" TEXT,
    "plt_city" VARCHAR(100),
    "plt_state" VARCHAR(100),
    "plt_country" VARCHAR(100),
    "plt_pincode" VARCHAR(20),
    "plt_gender" VARCHAR(20),
    "plt_dob" TIMESTAMP(3),
    "plt_profile_image" TEXT,
    "plt_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plt_created_by" UUID,

    CONSTRAINT "tbl_platform_2_pkey" PRIMARY KEY ("plt_id")
);

-- CreateTable
CREATE TABLE "tbl_church_applicants" (
    "chr_app_id" UUID NOT NULL,
    "chr_app_code" CHAR(8),
    "chr_app_name" VARCHAR(150),
    "chr_app_email" VARCHAR(255),
    "chr_app_denomination" VARCHAR(100),
    "chr_app_location" TEXT,
    "chr_app_timezone" VARCHAR(50),
    "chr_app_city" VARCHAR(100),
    "chr_app_state" VARCHAR(100),
    "chr_app_country" VARCHAR(100),
    "chr_app_pincode" VARCHAR(20),
    "chr_app_status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "chr_app_approved_by" UUID,
    "chr_app_approved_at" TIMESTAMP(3),
    "chr_app_applied_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_church_applicants_pkey" PRIMARY KEY ("chr_app_id")
);

-- CreateTable
CREATE TABLE "tbl_church" (
    "chr_id" UUID NOT NULL,
    "chr_code" VARCHAR(50) NOT NULL,
    "chr_name" VARCHAR(150) NOT NULL,
    "chr_email" VARCHAR(255),
    "chr_denomination" VARCHAR(100),
    "chr_location" TEXT,
    "chr_timezone" VARCHAR(50),
    "chr_subscription_plan" VARCHAR(50),
    "chr_approval_status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "chr_approved_by" UUID,
    "chr_approved_at" TIMESTAMP(3),
    "chr_address" TEXT,
    "chr_city" VARCHAR(100),
    "chr_state" VARCHAR(100),
    "chr_country" VARCHAR(100),
    "chr_pincode" VARCHAR(20),
    "chr_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chr_created_by" UUID,

    CONSTRAINT "tbl_church_pkey" PRIMARY KEY ("chr_id")
);

-- CreateTable
CREATE TABLE "tbl_church_user" (
    "chr_usr_id" SERIAL NOT NULL,
    "chr_id" UUID NOT NULL,
    "usr_id" UUID NOT NULL,
    "role_id" INTEGER NOT NULL,
    "chr_usr_status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "chr_usr_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chr_usr_created_by" UUID,

    CONSTRAINT "tbl_church_user_pkey" PRIMARY KEY ("chr_usr_id")
);

-- CreateTable
CREATE TABLE "tbl_platform_user" (
    "plt_usr_id" SERIAL NOT NULL,
    "plt_id" UUID NOT NULL,
    "role_id" INTEGER NOT NULL,
    "plt_usr_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_platform_user_pkey" PRIMARY KEY ("plt_usr_id")
);

-- CreateTable
CREATE TABLE "tbl_audit" (
    "adt_id" UUID NOT NULL,
    "adt_tenant_scope" VARCHAR(20) NOT NULL,
    "chr_id" UUID,
    "adt_entity_type" VARCHAR(50) NOT NULL,
    "adt_entity_id" UUID NOT NULL,
    "adt_action" VARCHAR(50) NOT NULL,
    "adt_actor_usr_id" UUID,
    "adt_actor_context" VARCHAR(50),
    "adt_ip_address" TEXT,
    "adt_old_data" JSONB,
    "adt_new_data" JSONB,
    "adt_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_audit_pkey" PRIMARY KEY ("adt_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_role_master_role_code_key" ON "tbl_role_master"("role_code");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_user_1_usr_email_key" ON "tbl_user_1"("usr_email");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_user_1_usr_phone_key" ON "tbl_user_1"("usr_phone");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_platform_1_plt_email_key" ON "tbl_platform_1"("plt_email");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_platform_1_plt_phone_key" ON "tbl_platform_1"("plt_phone");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_church_applicants_chr_app_code_key" ON "tbl_church_applicants"("chr_app_code");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_church_chr_code_key" ON "tbl_church"("chr_code");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_church_user_chr_id_usr_id_role_id_key" ON "tbl_church_user"("chr_id", "usr_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_platform_user_plt_id_role_id_key" ON "tbl_platform_user"("plt_id", "role_id");

-- AddForeignKey
ALTER TABLE "tbl_user_2" ADD CONSTRAINT "tbl_user_2_usr_id_fkey" FOREIGN KEY ("usr_id") REFERENCES "tbl_user_1"("usr_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_platform_2" ADD CONSTRAINT "tbl_platform_2_plt_id_fkey" FOREIGN KEY ("plt_id") REFERENCES "tbl_platform_1"("plt_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_church_applicants" ADD CONSTRAINT "tbl_church_applicants_chr_app_approved_by_fkey" FOREIGN KEY ("chr_app_approved_by") REFERENCES "tbl_platform_1"("plt_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_church" ADD CONSTRAINT "tbl_church_chr_approved_by_fkey" FOREIGN KEY ("chr_approved_by") REFERENCES "tbl_platform_1"("plt_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_church_user" ADD CONSTRAINT "tbl_church_user_chr_id_fkey" FOREIGN KEY ("chr_id") REFERENCES "tbl_church"("chr_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_church_user" ADD CONSTRAINT "tbl_church_user_usr_id_fkey" FOREIGN KEY ("usr_id") REFERENCES "tbl_user_1"("usr_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_church_user" ADD CONSTRAINT "tbl_church_user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "tbl_role_master"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_platform_user" ADD CONSTRAINT "tbl_platform_user_plt_id_fkey" FOREIGN KEY ("plt_id") REFERENCES "tbl_platform_1"("plt_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_platform_user" ADD CONSTRAINT "tbl_platform_user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "tbl_role_master"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;
