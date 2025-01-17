export const VERSIONS = {
    "1.0.162": {
        "react-native": "0.74.1",
        "react-native-reanimated": "^3.9.0",
        realm: "^11.10.2",
        "react-native-rsa-native": "^2.0.5",
        "react-native-gesture-handler": "^2.22.0",
        "react-native-safe-area-context": "^4.10.1",
        "react-native-screens": "^3.31.1",
        "@notifee/react-native": "^7.8.2",
        "react-native-pager-view": "^6.3.1",
        "react-native-device-info": "^10.13.2",
        "react-native-image-crop-picker": "^0.41.1",
        "react-native-permissions": "^3.6.1",
        "react-native-vector-icons": "9.2.0",
        "react-native-nano": "^1.0.163",
        "rn-nano-sync": "1.0.6",
    },
    "1.0.172": {
        "react-native": "0.74.1",
        "react-native-reanimated": "^3.9.0",
        realm: "^11.10.2",
        "react-native-rsa-native": "^2.0.5",
        "react-native-safe-area-context": "^4.10.1",
        "react-native-screens": "^3.31.1",
        "@notifee/react-native": "^7.8.2",
        "react-native-pager-view": "^6.3.1",
        "react-native-device-info": "^10.13.2",
        "react-native-image-crop-picker": "^0.41.1",
        "react-native-permissions": "^3.6.1",
        "react-native-vector-icons": "9.2.0",
        "react-native-nano": "^1.0.163",
        "rn-nano-sync": "1.0.7",
    },
};
export const getPackageVersion = ({ packagename, rnNanoVersion, }) => {
    if (packagename == null || packagename.length == 0) {
        return "";
    }
    else if (rnNanoVersion == null || rnNanoVersion.length == 0) {
        const versionsArray = Object.keys(VERSIONS);
        let latestVersion = versionsArray[0];
        for (const version in versionsArray) {
            if (!latestVersion || version > latestVersion) {
                latestVersion = version;
            }
        }
        return "@" + VERSIONS[latestVersion][packagename];
    }
    return "@" + VERSIONS[rnNanoVersion][packagename];
};
//# sourceMappingURL=versions.js.map