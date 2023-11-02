import { runCommand } from "../common.js";

export const renameAndroidProject = ({ userCommand }) => {
  const command = `git init && npx react-native-rename ${userCommand}`;
  const commandRes = runCommand(command);

  if (!commandRes) process.exit(-1);
};
