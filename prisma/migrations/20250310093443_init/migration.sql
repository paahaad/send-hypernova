-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pubkey" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "website" TEXT NOT NULL,
    "twitter" TEXT NOT NULL,
    "supply" TEXT NOT NULL,
    "mint" TEXT NOT NULL,
    "presalePool" TEXT NOT NULL,
    "liquidiyPool" TEXT NOT NULL,
    "vault" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_id_key" ON "Token"("id");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
