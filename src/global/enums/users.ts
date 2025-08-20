// when changing or adding any role then change

import { UserGender, UserRole } from "../../app/share/Prisma/inteface.prisma";

/* //? add a user model in 1. (save) pre method in add if condition , 2.isUserFindMethod in add aggregation,
 */
export const ENUM_USER_TYPE = UserRole;
export const ENUM_GENDER = UserGender;
