import { execSync, exec } from "child_process";
import { COMMAND_ARGUMENTS,KEYSTORE_ARGUMENTS } from "./Constants.js";
export const runCommand = (command) => {
  try {
    execSync(`${command}`);
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }
  return true;
};
export const getNanoVersionAndReactNativeVersion = ({
  firstArgCommand,
  firstArgValue,
  secondArgCommand,
  secondArgValue,
}) => {
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

export const downloadFileAtPathGiven = ({ url, path }) => {
  const downloadAppjsCommand = `cd ${path} && curl -s -S -LJO ${url} > /dev/null  `;
  const downloadresult = runCommand(downloadAppjsCommand);
  if (!downloadresult) process.exit(-1);
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


export const getKeystorePathAndPasswordArray = ({
  firstArgCommand,
  firstArgValue,
  secondArgCommand,
  secondArgValue,
}) => {
  // returns [keystorepath, password]
  console.log("INITITI", secondArgCommand, secondArgValue);

  if (secondArgCommand != null && secondArgValue != null) {
    console.log("FIRST ARG",firstArgCommand, KEYSTORE_ARGUMENTS.PATH );
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