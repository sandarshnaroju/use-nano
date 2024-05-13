export const VERSIONS = {
  "1.0.163": {
    "react-native": "0.74.0",
    "react-native-reanimated": "3.9.0",
    realm: "11.10.2",
  },
  "1.0.62": {},
};

export const getPackageVersion = ({
  packagename,
  rnNanoVersion,
}: {
  packagename: string;
  rnNanoVersion: string;
}): string => {
  if (packagename == null || packagename.length == 0) {
    return "";
  } else if (rnNanoVersion == null || rnNanoVersion.length == 0) {
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
