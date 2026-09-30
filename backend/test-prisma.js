import prisma from "./lib/prisma.js";

const users = await prisma.user.findMany();

console.log(users);

await prisma.$disconnect();