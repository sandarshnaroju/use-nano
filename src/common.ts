import { execSync, exec } from "child_process";

import fs from "fs";
import { COMMAND_ARGUMENTS } from "./Constants.js";
export const runCommand = (command: string) => {
  try {
    execSync(`${command}`);
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }
  return true;
};
// enum COMMAND_ARGUMENTS {
//   NANO_VERSION = "--nano-version",
//   REACT_NATIVE_VERSION = "--react-native-version",
// }

type VersionTuple = [string | null, string | null];
interface Args {
  firstArgCommand: string | COMMAND_ARGUMENTS | null;
  firstArgValue: string | null;
  secondArgCommand: string | COMMAND_ARGUMENTS | null;
  secondArgValue: string | null;
}
export const getNanoVersionAndReactNativeVersion = ({
  firstArgCommand,
  firstArgValue,
  secondArgCommand,
  secondArgValue,
}: Args): VersionTuple => {
  // returns [nanoVersion, react native version]

  if (secondArgCommand != null && secondArgValue != null) {
    if (firstArgCommand == COMMAND_ARGUMENTS.NANO_VERSION) {
      if (secondArgCommand == COMMAND_ARGUMENTS.REACT_NATIVE_VERSION) {
        // provided both
        return [firstArgValue, secondArgValue];
      } else {
        return [firstArgValue, null];
      }
    } else if (firstArgCommand == COMMAND_ARGUMENTS.REACT_NATIVE_VERSION) {
      if (secondArgCommand == COMMAND_ARGUMENTS.NANO_VERSION) {
        return [secondArgValue, firstArgValue];
      } else {
        return [null, firstArgValue];
      }
    }
  } else {
    // only one param is given i.e first param
    if (firstArgCommand == COMMAND_ARGUMENTS.NANO_VERSION) {
      // provided only nano version
      return [firstArgValue, null];
    } else if (firstArgCommand == COMMAND_ARGUMENTS.REACT_NATIVE_VERSION) {
      // provided only react native version

      return [null, firstArgValue];
    } else {
      // provided none
      return [null, null];
    }
  }
  return [null, null];
};


export const moveFile = ({ path, source, destination }) => {
  let downloadAppjsCommand = "";
  if (path) {
    downloadAppjsCommand = `cd ${path} && mv ${source} ${destination}`;
  } else {
    downloadAppjsCommand = `mv ${source} ${destination}`;
  }
  const downloadresult = runCommand(downloadAppjsCommand);
  if (!downloadresult) process.exit(-1);
};

enum KEYSTORE_ARGUMENTS {
  PATH = "--keystore",
  PASSWORD = "--keystorepassword",
}

type KeystoreInfo = [string | null, string | null];

interface KeystoreArgs {
  firstArgCommand: KEYSTORE_ARGUMENTS | null;
  firstArgValue: string | null;
  secondArgCommand: KEYSTORE_ARGUMENTS | null;
  secondArgValue: string | null;
}

export const getKeystorePathAndPasswordArray = ({
  firstArgCommand,
  firstArgValue,
  secondArgCommand,
  secondArgValue,
}: KeystoreArgs): KeystoreInfo => {
  // returns [keystorepath, password]

  if (secondArgCommand != null && secondArgValue != null) {
    if (firstArgCommand == KEYSTORE_ARGUMENTS.PATH) {
      if (secondArgCommand == KEYSTORE_ARGUMENTS.PASSWORD) {
        // provided both
        return [firstArgValue, secondArgValue];
      } else {
        return [firstArgValue, null];
      }
    } else if (firstArgCommand == KEYSTORE_ARGUMENTS.PASSWORD) {
      if (secondArgCommand == KEYSTORE_ARGUMENTS.PATH) {
        return [secondArgValue, firstArgValue];
      } else {
        return [null, firstArgValue];
      }
    }
  } else {
    // only one param is given i.e first param
    if (firstArgCommand == KEYSTORE_ARGUMENTS.PATH) {
      // provided only PATH
      return [firstArgValue, null];
    } else if (firstArgCommand == KEYSTORE_ARGUMENTS.PASSWORD) {
      // provided only password

      return [null, firstArgValue];
    } else {
      // provided none
      return [null, null];
    }
  }
  return [null, null];
};

export const moveFileByNode = (oldPath, newPath, callback) => {
  fs.rename(oldPath, newPath, function (err) {
    if (err) {
      if (err.code === "EXDEV") {
        copy();
      } else {
        callback(err);
      }
      return;
    }
    callback();
  });

  function copy() {
    var readStream = fs.createReadStream(oldPath);
    var writeStream = fs.createWriteStream(newPath);

    readStream.on("error", callback);
    writeStream.on("error", callback);

    readStream.on("close", function () {
      fs.unlink(oldPath, callback);
    });

    readStream.pipe(writeStream);
  }
};
