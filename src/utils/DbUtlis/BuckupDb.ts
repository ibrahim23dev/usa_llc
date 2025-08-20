import { spawn } from "child_process";
import path from "path";
import schedule from "node-schedule";
import config from "../../config";
import { errorLogger, logger } from "../../app/share/logger";

/* 
Basic mongo dump and restore commands, they contain more options you can have a look at man page for both of them.
1. mongodump --db=rbac_tutorial --archive=./rbac.gzip --gzip
2. mongorestore --db=rbac_tutorial --archive=./rbac.gzip --gzip

Using mongodump - without any args:
  will dump each and every db into a folder called "dump" in the directory from where it was executed.
Using mongorestore - without any args:
  will try to restore every database from "dump" folder in current directory, if "dump" folder does not exist then it will simply fail.
*/

const DB_NAME = config.database.name;
const ARCHIVE_PATH = path.join(__dirname, "../../backupdb", `${DB_NAME}.gzip`);

// 1. Cron expression for every 5 seconds - */5 * * * * *
// 2. Cron expression for every night at 00:00 hours (0 0 * * * )
// Note: 2nd expression only contains 5 fields, since seconds is not necessary

// Scheduling the backup every 5 seconds (using node-cron)
// 0 */12 * * *

function backupMongoDB() {
  const child = spawn("mongodump", [
    `--db=${DB_NAME}`,
    `--archive=${ARCHIVE_PATH}`,
    "--gzip",
  ]);

  child.stdout.on("data", data => {
    if (config.env === "production") {
      errorLogger.info(JSON.stringify({ commend: "stdout:\n", data }));
    } else {
      console.log("stdout:\n", data);
    }
  });
  child.stderr.on("data", data => {
    if (config.env === "production") {
      // errorLogger.info(JSON.stringify('stdout:\n', data));
    } else {
      console.log("stderr:\n", Buffer.from(data).toString());
    }
  });
  child.on("error", error => {
    if (config.env === "production") {
      errorLogger.error(error);
    } else {
      console.log("error:\n", error);
    }
  });
  child.on("exit", (code, signal) => {
    if (code) {
      if (config.env === "production") {
        errorLogger.error(
          JSON.stringify({ commend: "Process exit with code:", code }),
        );
      } else {
        console.log("error:\n", code);
      }
    } else if (signal) {
      if (config.env === "production") {
        errorLogger.error(
          JSON.stringify({ commend: "Process killed with signal:", signal }),
        );
      } else {
        console.log("error:\n", signal);
      }
    } else {
      if (config.env === "production") {
        errorLogger.info("Backup is successfull ✅");
      } else {
        console.log("Backup is successfull ✅");
      }
    }
  });
}

export const RunBackup = () => {
  let job;
  if (!job) {
    job = schedule.scheduleJob("0 */12 * * *", () => backupMongoDB()); //every 12 hours
  }
};
