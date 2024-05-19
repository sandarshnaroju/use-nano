export const commonUrl = "https://raw.githubusercontent.com/sandarshnaroju/nano-starter-template/master/";
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
export var COMMAND_ARGUMENTS;
(function (COMMAND_ARGUMENTS) {
    COMMAND_ARGUMENTS["NANO_VERSION"] = "nano-version";
    COMMAND_ARGUMENTS["REACT_NATIVE_VERSION"] = "react-native-version";
    COMMAND_ARGUMENTS["REACT_NATIVE_REANIMATED"] = "react-native-reanimated";
    COMMAND_ARGUMENTS["REALM"] = "realm";
    COMMAND_ARGUMENTS["REACT_NATIVE_RSA_NATIVE"] = "react-native-rsa-native";
    COMMAND_ARGUMENTS["REACT_NATIVE_SAFE_AREA_CONTEXT"] = "react-native-safe-area-context";
    COMMAND_ARGUMENTS["REACT_NATIVE_SCREENS"] = "react-native-screens";
    COMMAND_ARGUMENTS["REACT_NATIVE_NOTIFEE"] = "@notifee/react-native";
    COMMAND_ARGUMENTS["REACT_NATIVE_PAGER_VIEW"] = "react-native-pager-view";
})(COMMAND_ARGUMENTS || (COMMAND_ARGUMENTS = {}));
export const KEYSTORE_ARGUMENTS = {
    PATH: "--keystore",
    PASSWORD: "--keystorepassword",
};
//# sourceMappingURL=constants.js.map