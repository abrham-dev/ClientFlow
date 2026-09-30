import prisma from "./lib/prisma.js";

const client = await prisma.client.create({
  data: {
    name: "John Doe",
    email: "john@example.com",
    company: "Acme Inc",
  },
});

console.log(client);

await prisma.$disconnect();