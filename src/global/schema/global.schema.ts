import { z } from "zod";
import { PrismaEnum } from "../../app/adapters/Prisma/interface.prisma";
export const zodSlugSchema = z.string().transform(val =>
  val
    .trim()
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, "") // allow letters, marks (like diacritics), numbers, whitespace, hyphens
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase(),
);
export const zodFileAfterUploadSchema = z
  .object(
    {
      id: z.string().cuid().optional(), // Unique identifier for the file, can be null
      url: z.string().optional(),
      cdn: z.string().optional(),
      mimetype: z.string(),
      originalUrl: z.string(),

      modifyFileName: z.string(),
      path: z.string(),
      filename: z.string(),
      fileUniqueId: z.string().optional().nullable(), // Unique identifier for the file, can be null

      size: z.coerce.number().optional(), // size in bytes
      platform: z.nativeEnum(PrismaEnum.ImagePlatform), // Assuming IImagePlatform is a string type
      caption_title: z.string().optional(),
      thumb_image_size: z
        .object({ height: z.coerce.number(), width: z.coerce.number() })
        .optional(), // height and width
      large_image_size: z
        .object({ height: z.coerce.number(), width: z.coerce.number() })
        .optional(),
      medium_image_size: z
        .object({ height: z.coerce.number(), width: z.coerce.number() })
        .optional(),
      small_image_size: z
        .object({ height: z.coerce.number(), width: z.coerce.number() })
        .optional(),
    },
    { required_error: "File is Required" },
  )
  .strip();

export const zodLocationSchema = z.object({
  link: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  coordinates: z.array(z.number()).length(2), // first -> longitude,latitude
});
//-------------------------------------------------------------

export type IPricing = {
  price: number;
  currency?: string;
  discount?: number;
  vat?: number;
  tax?: number;
};

export const zodPricingSchema = z.object({
  price: z.number({ required_error: "Price is required" }).min(0),
  discount: z.number().min(0).optional(),
  vat: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
  currency: z.string().optional(),
});
//------------------------------------------------------------------

export const zodAmountSchema = z.coerce
  .number()
  .nonnegative({ message: "Amount must be a positive number" })
  .transform(val => Number(val.toFixed(2))); // Ensures 2 decimal places
