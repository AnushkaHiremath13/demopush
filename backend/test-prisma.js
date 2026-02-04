const prisma = require("./src/config/prisma");

(async () => {
  const users = await prisma.tbluser1.findMany();
  console.log(users);
  await prisma.$disconnect();
})();
