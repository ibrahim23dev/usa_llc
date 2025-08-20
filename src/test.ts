// import { prismaClient } from "./app/share/Prisma/prisma";

import { seedUserData } from "./global/seed/users.seed";
import { createDirectories } from "./utils/createDir";
const TestFile = async () => {
  try {
    createDirectories();
    await asyncFunction();
  } catch (error) {
    console.log(error);
  }
};

const asyncFunction = async () => {
  try {
    await seedUserData();
    // const res = await prismaClient.user.findMany({
    //   where: {},
    // });
    // for (let i = 0; i < res.length; i++) {
    //   console.log(res[i]);
    //   const wallte = await prismaClient.wallet.create({
    //     data: {
    //       user_id: res[i].id,
    //       balance: 0,
    //     },
    //   });
    // }

    return 1;
  } catch (error) {
    console.log(error);
  }
};

export { TestFile };
