import { runCommand } from "../../common.js";

export const createLauncherIcon = ({
  userCommand,
}: {
  userCommand: string;
}): void => {
  const command = `npx icon-set-creator ${userCommand}`;
  const commandRes = runCommand(command);

  if (!commandRes) process.exit(-1);
};
