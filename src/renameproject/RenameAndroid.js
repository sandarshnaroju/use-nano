import { runCommand } from "../common.js";

export const renameAndroidProject = ({ userCommand }) => {
  const command = `npx react-native-rename@latest ${userCommand}`;
  const commandRes = runCommand(command);

  if (!commandRes) process.exit(-1);
};
