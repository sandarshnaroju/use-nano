export const VERSIONS = {
    "1.0.163": {
        "react-native": "0.74.0",
        "react-native-reanimated": "3.9.0",
        realm: "11.10.2",
    },
    "1.0.62": {},
};
export const VERSIONS_BY_REACT_NATIVE = {
    "0.74.0": {
        "react-native-reanimated": "3.9.0",
    },
    "0.71.4": {
        "react-native-reanimated": "3.6.2",
    },
};
export const getPackageVersion = ({ packagename, rnNanoVersion }) => {
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
//# sourceMappingURL=Versions.js.map