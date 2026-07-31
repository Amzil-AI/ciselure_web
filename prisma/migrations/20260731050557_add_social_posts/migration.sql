-- CreateTable
CREATE TABLE "SocialPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "topic" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "article" TEXT NOT NULL,
    "hashtags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SocialPostImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "socialPostId" INTEGER NOT NULL,
    "imageId" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SocialPostImage_socialPostId_fkey" FOREIGN KEY ("socialPostId") REFERENCES "SocialPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SocialPostImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SocialPostImage_socialPostId_imageId_key" ON "SocialPostImage"("socialPostId", "imageId");
