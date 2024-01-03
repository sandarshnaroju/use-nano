export const commonUrl =
  "https://raw.githubusercontent.com/sandarshnaroju/nano-starter-template/master/";
export const themeText = `const lightTheme = {
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

export const COMMAND_ARGUMENTS = {
  NANO_VERSION: "--nano-version",
  REACT_NATIVE_VERSION: "--react-native-version",
};

export const KEYSTORE_ARGUMENTS = {
  PATH: "--keystore",
  PASSWORD: "--keystorepassword",
};
