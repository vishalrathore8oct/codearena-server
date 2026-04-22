import { prisma } from "../db/prisma.js";

export const generateUniqueUsernameForDB = async (
  fullName: string,
): Promise<string> => {
  const base = fullName.toLowerCase().replace(/[^a-z0-9]/g, "");

  const existingBase = await prisma.user.findUnique({
    where: { username: base },
  });

  if (!existingBase) {
    return base;
  }

  let username = "";
  let isUnique = false;

  while (!isUnique) {
    const random = Math.floor(1000 + Math.random() * 9000);
    const candidate = `${base}${random}`;

    const existing = await prisma.user.findUnique({
      where: { username: candidate },
    });

    if (!existing) {
      username = candidate;
      isUnique = true;
    }
  }

  return username;
};
