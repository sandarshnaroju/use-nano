export const commonUrl: string =
  "https://raw.githubusercontent.com/sandarshnaroju/nano-starter-template/master/";
export const themeText: string = `const lightTheme = {
    name: "light",
    isDark: false,
    colors: {
      primary: "blue",
      secondary: "#800460",
      background: "#e0f4f4",
    },
  };
  const darkTheme = {
    name: "dark",
    isDark: true,
    colors: {
      primary: "black",
      secondary: "yellow",
      background: "gray",
    },
  };
  
  export const THEMES = [lightTheme, darkTheme];
  `;

export const enum COMMAND_ARGUMENTS {
  NANO_VERSION = "nano-version",
  REACT_NATIVE_VERSION = "react-native-version",
  REACT_NATIVE_REANIMATED = "react-native-reanimated",
  REALM = "realm",
}

export const KEYSTORE_ARGUMENTS: Record<string, string> = {
  PATH: "--keystore",
  PASSWORD: "--keystorepassword",
};
