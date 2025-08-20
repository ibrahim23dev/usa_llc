import { PrismaClient } from "@prisma/client";
// import bcrypt from 'bcryptjs';
import * as bcrypt from "bcryptjs";
import config from "../../config";

const prisma = new PrismaClient();

export async function seedUserData() {
  const adminPassword = "NARIA112233"; // Use a secure password here
  const b2bPassword = "NARIA112233"; // Use a secure password here
  const b2cPassword = "NARIA112233"; // Use a secure password here
  const adminHashedPassword = await bcrypt.hash(
    adminPassword,
    Number(config.bycrypt_salt_rounds),
  );
  const b2bHashedPassword = await bcrypt.hash(
    b2bPassword,
    Number(config.bycrypt_salt_rounds),
  );
  const b2cHashedPassword = await bcrypt.hash(
    b2cPassword,
    Number(config.bycrypt_salt_rounds),
  );

  // Create the admin user
  const existingAdminUser = await prisma.user.findFirst({
    where: {
      email: "sampodnathnariait@gmail.com",
      user_type: "admin",
    },
  });
  const existingAdminUser2 = await prisma.user.findFirst({
    where: {
      email: "mohammad.98482@gmail.com",
      user_type: "admin",
    },
  });
  const existingAdminUser3 = await prisma.user.findFirst({
    where: {
      email: "mohammad.98482@gmail.com",
      user_type: "admin",
    },
  });

  if (!existingAdminUser) {
    const user = await prisma.user.create({
      data: {
        email: "sampodnathnariait@gmail.com",
        username: "sampod",
        password: adminHashedPassword,
        user_type: "admin",
        is_main_account: true,
        verification_status: "approved",
        is_email_verified: true,
        account_type: "custom",
        wallet: {
          create: {
            balance: 0,
            currency: "bdt",
          },
        },

        admin: {
          create: {
            firstName: "Sampod",
            lastName: "User",
            phone: "01916498482",
            dateOfBirth: "1990-01-01",
            gender: "male",
            image: {
              create: {
                url: "https://djht95tjlbcen.cloudfront.net/upload/images/fronte-1745148012017.jpg",
                originalUrl:
                  "https://naria-travels.s3.ap-south-1.amazonaws.com/upload/images/fronte-1745148012017.jpg",
                filename: "fronte.jpg",
                modifyFileName: "fronte-1745148012017.jpg",
                mimetype: "image/jpg",
                platform: "aws",
                path: "upload/images/fronte-1745148012017.jpg",
                cdn: "https://djht95tjlbcen.cloudfront.net",
              },
            },
          },
        },
      },
      include: {
        admin: true,
      },
    });

    console.log("✅ Admin user created:", user.id);
  }
  if (!existingAdminUser2) {
    const user = await prisma.user.create({
      data: {
        email: "mohammad.98482@gmail.com",
        username: "mohammad",
        password: adminHashedPassword,
        user_type: "admin",
        is_main_account: true,
        verification_status: "approved",
        is_email_verified: true,
        account_type: "custom",
        wallet: {
          create: {
            balance: 0,
            currency: "bdt",
          },
        },

        admin: {
          create: {
            firstName: "Mohammad",
            lastName: "User",
            phone: "01916498482",
            dateOfBirth: "1990-01-01",
            gender: "male",
            image: {
              create: {
                url: "https://djht95tjlbcen.cloudfront.net/upload/images/fronte-1745148012017.jpg",
                originalUrl:
                  "https://naria-travels.s3.ap-south-1.amazonaws.com/upload/images/fronte-1745148012017.jpg",
                filename: "fronte.jpg",
                modifyFileName: "fronte-1745148012017.jpg",
                mimetype: "image/jpg",
                platform: "aws",
                path: "upload/images/fronte-1745148012017.jpg",
                cdn: "https://djht95tjlbcen.cloudfront.net",
              },
            },
          },
        },
      },
      include: {
        admin: true,
      },
    });
    console.log("✅ Admin user created:", user.id);
  }

  // Create the user with user_type "b2b"
  const existingB2BUser = await prisma.user.findFirst({
    where: {
      email: "b2b@gmail.com",
      user_type: "b2b",
    },
  });

  if (!existingB2BUser) {
    const b2bUser = await prisma.user.create({
      data: {
        email: "b2b@gmail.com",
        username: "b2b",
        password: b2bHashedPassword,
        user_type: "b2b",
        is_email_verified: true,
        is_main_account: true,
        verification_status: "approved",

        account_type: "custom",
        wallet: {
          create: {
            balance: 0,
            currency: "bdt",
          },
        },

        b2b: {
          create: {
            firstName: "B2B",
            lastName: "User",
            phone: "01916498483",
            dateOfBirth: "1990-01-01",
          },
        },
      },
    });

    console.log("✅ B2b user created:", b2bUser.id);
  }

  // Create the user with user_type "b2c"
  const existingB2CUser = await prisma.user.findFirst({
    where: {
      email: "b2c@gmail.com",
      user_type: "b2c",
    },
  });

  if (!existingB2CUser) {
    const b2cUser = await prisma.user.create({
      data: {
        email: "b2c@gmail.com",
        username: "b2c",
        password: b2cHashedPassword,
        user_type: "b2c",
        is_email_verified: true,
        verification_status: "approved",
        is_main_account: true,

        account_type: "custom",
        wallet: {
          create: {
            balance: 0,
            currency: "bdt",
          },
        },

        b2c: {
          create: {
            firstName: "B2C",
            lastName: "User",
            phone: "01916498483",
            dateOfBirth: "1990-01-01",
          },
        },
      },
    });

    console.log("✅ B2c user created:", b2cUser.id);
  }
}
