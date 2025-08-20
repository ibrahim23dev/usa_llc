import fs from "fs";
import path from "path";

// Function to check and create directories
export function createDirectories(baseDir?: string, folders?: string[]): void {
  const defaultBaseDir: string = path.join(__dirname, "../../../uploadFile");
  const defaultFolders: string[] = [
    "images",
    "audios",
    "pdfs",
    "videos",
    "docs",
    "others",
  ];
  const finalBaseDir = baseDir
    ? path.join(__dirname, baseDir as string)
    : defaultBaseDir;
  const finalFolders = folders || defaultFolders;

  // Check if base directory exists, if not create it
  if (!fs.existsSync(finalBaseDir)) {
    fs.mkdirSync(finalBaseDir);
    console.log(`Created base directory: ${finalBaseDir}`);
  }
  const backupDir = path.join(__dirname, "../../../backupdb");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
    console.log(`Created base directory: ${backupDir}`);
  }
  // Iterate through the folders and create them if they don't exist
  finalFolders.forEach(folder => {
    const folderPath = path.join(finalBaseDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      console.log(`Created folder: ${folderPath}`.green);
    } else {
      console.log(`Folder already exists: ${folderPath}`.red);
    }
  });
}
