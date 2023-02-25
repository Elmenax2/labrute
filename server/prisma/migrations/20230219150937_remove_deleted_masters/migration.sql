-- Set brute.masterId to null where master.deletedAt is not null
UPDATE "Brute" SET "masterId" = NULL WHERE "deletedAt" IS NULL AND "masterId" IN (SELECT "id" FROM "Brute" WHERE "deletedAt" IS NOT NULL);