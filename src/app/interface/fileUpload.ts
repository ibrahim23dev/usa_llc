export type IMulterUploadFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};

export type IAws_MulterUploadFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  acl: string;
  contentType: string | null;
  contentDisposition: string | null;
  contentEncoding: string | null;
  storageClass: string;
  serverSideEncryption: string | null;
  metadata: {
    fieldName: string;
    authorInfo: string;
  };
  location: string;
  etag: string;
};
export type IImagePlatform = "imgbb" | "cloudinary" | "server" | "aws" | string;
export const I_IMAGE_PLATFORM_ARRAY = ["imgbb", "cloudinary", "server", "aws"];
export type IFileAfterUpload = {
  mimetype: string;
  server_url?: string;
  filename?: string;
  fileUniqueId?: string;
  name?: string;
  uid?: string;
  path?: string;
  url?: string;
  originalUrl?: string;
  durl?: string;
  platform: IImagePlatform;
  cdn?: string; //https://www.youtube.com/watch?v=kbI7kRWAU-w
};

/* 
  {
  fieldname: 'image',
  originalname: 'download.png',
  encoding: '7bit',
  mimetype: 'image/png',
  destination: 'C:\\Users\\Sampod\\Desktop\\choutamar-UAA\\uploadFile\\images\\',
  filename: 'download-1711100541497.png',
  path: 'C:\\Users\\Sampod\\Desktop\\choutamar-UAA\\uploadFile\\images\\download-1711100541497.png',
  size: 349777
}
  
  */

export type ICloudinaryResponse = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename?: string;
  original_extension: string;
  api_key: string;
};
