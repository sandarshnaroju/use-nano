import inquirer from "inquirer";
import { runCommand } from "../common.js";
import fs from "fs";

let keyStoreName = "keystore.jks";
export const askUserInfoToGenerateKeyStoreFile = () => {
  inquirer
    .prompt([
      /* Pass your questions in here */

      {
        type: "input",
        name: "keystore_path",

        message: "name of generated keystore file",
      },
      {
        type: "input",
        name: "validity",
        message: "Enter validity in days",
      },
      {
        type: "input",
        name: "alias",
        message: "Enter alias",
      },
      {
        type: "input",
        name: "alias_password",
        message: "Enter alias password",
      },
      {
        type: "input",
        name: "store_pass",
        message: "Enter store password",
      },

      {
        type: "input",
        name: "cn",
        message: "Enter your name",
      },
      {
        type: "input",
        name: "ou",
        message: "Enter your organisational unit name(without spaces)",
      },
      {
        type: "input",
        name: "org",
        message: "Enter organisation name(without spaces)",
      },
      {
        type: "input",
        name: "country",
        message: "Enter your country",
      },
    ])
    .then((answers) => {
      if (
        answers != null &&
        answers["keystore_path"] != null &&
        answers["validity"] != null &&
        answers["alias"] != null &&
        answers["alias_password"] != null &&
        answers["store_pass"] != null &&
        answers["cn"] != null &&
        answers["ou"] != null &&
        answers["org"] != null &&
        answers["country"] != null
      ) {
        const generatedDname = `"cn=${answers["cn"]}, ou=${answers["ou"]}, o=${answers["org"]}, c=${answers["country"]}"`;
        // keyStoreName = answers["keystore_path"];
        generateKeyStoreFile({
          alias: answers["alias"],
          aliasPassword: answers["alias_password"],
          dName: generatedDname,
          keyAlgorithm: "RSA",
          keySize: 2048,
          keystoreFileName: answers["keystore_path"],
          keyStorepassword: answers["store_pass"],
          validity: answers["validity"],
        });
      }
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
};

export const generateKeyStoreFile = ({
  keystoreFileName,
  keyAlgorithm,
  keySize,
  validity,
  alias,
  keyStorepassword,
  aliasPassword,
  dName,
}) => {
  // dname format is "cn=Mark Jones, ou=JavaSoft, o=Sun, c=US"
  const comm = `keytool -genkey -v -keystore ${keystoreFileName} -keyalg ${keyAlgorithm} -keysize ${keySize} -validity ${validity} -alias ${alias} -storepass ${keyStorepassword} -keypass ${aliasPassword} -dname ${dName}`;
  const result = runCommand(comm);

  if (!result) process.exit(-1);
};

export const generateApkWhenKeyStoreExists = ({
  keyStoreName,
  keyStorePassword,
}) => {
  console.log("Generating unsigned release apk");
  generateUnsignedReleaseApk();
  console.log("Zip aligning unsigned release apk");

  zipAlignUnSignedApk({
    unSignedApk: "unSignedRelease.apk",
    alignedUnsignedApkName: "zipAlignedUnSignedRelease.apk",
  });

  generateSignedApk({
    keyStoreFile: keyStoreName,
    signedApkName: "signedRelease.apk",
    unsignedApk: "android/unSignedRelease.apk",
    password: keyStorePassword,
  });
  console.log("verifying release apk ");

  verifySignedApk({ signedApkFile: "signedRelease.apk" });

  cleanupAfterGenerating();
  console.log(" Release apk : signedRelease.apk is generated")
};
export const generateDebugApkWhenKeyStoreExists = ({
  keyStoreName,
  keyStorePassword,
}) => {
  console.log("Generating unsigned debug apk");
  generateUnsignedDebugApk();
  console.log("Zip aligning unsigned debug apk");

  zipAlignUnSignedApk({
    unSignedApk: "unSignedDebug.apk",
    alignedUnsignedApkName: "zipAlignedUnSignedDebug.apk",
  });
 

  generateSignedApk({
    keyStoreFile: keyStoreName,
    signedApkName: "signedDebug.apk",
    unsignedApk: "android/unSignedDebug.apk",
    password: keyStorePassword,
  });
  console.log("verifying debug apk ");

  verifySignedApk({ signedApkFile: "signedDebug.apk" });

  cleanupAfterGenerating();
  console.log(" Debug apk : signedDebug.apk is generated")

};

export const initialiseApkGeneration = () => {
  const filePath = "keystore.jks";
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filePath} does not exist.`);
      askUserInfoToGenerateKeyStoreFile();
      generateApkWhenKeyStoreExists();
    } else {
      console.log(`File ${filePath} exists.`);
      generateApkWhenKeyStoreExists();
    }
  });
};
const cleanupAfterGenerating = () => {
  const comm = `rm -rf signedDebug.apk.idsig && rm -rf signedRelease.apk.idsig && cd android && rm -rf unSignedRelease.apk && rm -rf zipAlignedUnSignedRelease.apk && rm -rf unSignedDebug.apk && rm -rf zipAlignedUnSignedDebug.apk`;
  const result = runCommand(comm);

  if (!result) process.exit(-1);
};
//////////////Apk ////////////////////
// Run from root
export const generateUnsignedDebugApk = () => {
  // generate debug apk and copy it from android/app/build/outputs/apk/debug to android/unSignedDebugApk.apk
  const comm =
    "cd android && ./gradlew assembleDebug && mv app/build/outputs/apk/debug/app-debug.apk unSignedDebug.apk ";
  const result = runCommand(comm);

  if (!result) process.exit(-1);
};

export const generateUnsignedReleaseApk = () => {
  const comm =
    "cd android && ./gradlew assembleRelease && mv app/build/outputs/apk/release/app-release.apk unSignedRelease.apk";
  const result = runCommand(comm);

  if (!result) process.exit(-1);
};
export const zipAlignUnSignedApk = ({
  unSignedApk,
  alignedUnsignedApkName,
}) => {
  const comm = `cd android && zipalign -v -p 4 ${unSignedApk} ${alignedUnsignedApkName} `;
  const result = runCommand(comm);

  if (!result) process.exit(-1);
};
export const generateSignedApk = ({
  keyStoreFile,
  signedApkName,
  unsignedApk,
  password,
}) => {
  const comm = `apksigner sign --ks ${keyStoreFile}  --ks-pass pass:${password}  --out ${signedApkName} ${unsignedApk} `;
  const result = runCommand(comm);

  if (!result) process.exit(-1);
};
export const verifySignedApk = ({ signedApkFile }) => {
  const comm = ` apksigner verify ${signedApkFile}  `;
  const result = runCommand(comm);

  if (!result) process.exit(-1);
};

///////////////////Aab/////////////////////
export const generateUnsignedDebugAab = () => {
  const comm =
    "cd android && ./gradlew bundleDebug && mv app/build/outputs/bundle/debug/app-debug.aab unSignedDebug.aab";
  const result = runCommand(comm);

  if (!result) process.exit(-1);
};

export const generateUnsignedReleaseAab = () => {
  const comm =
    "cd android && ./gradlew bundleRelease && mv app/build/outputs/bundle/release/app-release.aab unSignedRelease.aab";
  const result = runCommand(comm);

  if (!result) process.exit(-1);
};

export const zipAlignUnSignedAab = ({
  unSignedAab,
  alignedUnsignedAabName,
}) => {
  const comm = `cd android && zipalign -v -p 4 ${unSignedAab} ${alignedUnsignedAabName} `;
  const result = runCommand(comm);

  if (!result) process.exit(-1);
};

export const generateSignedAab = ({
  keyStoreFile,
  signedAabName,
  unsignedAab,
  password,
}) => {
  const comm = `apksigner sign --ks ${keyStoreFile} --min-sdk-version 21 --ks-pass pass:${password} --out ${signedAabName} ${unsignedAab} `;
  const result = runCommand(comm);

  if (!result) process.exit(-1);
};

export const verifySignedAab = ({ signedAabFile }) => {
  const comm = `apksigner verify ${signedAabFile}  `;
  const result = runCommand(comm);

  if (!result) process.exit(-1);
};

const cleanupAabsAfterGenerating = () => {
  const comm = `rm -rf signedDebug.aab.idsig && rm -rf signedRelease.aab.idsig && cd android && rm -rf unSignedRelease.aab && rm -rf zipAlignedUnSignedRelease.aab && rm -rf unSignedDebug.aab && rm -rf zipAlignedUnSignedDebug.aab`;
  const result = runCommand(comm);

  if (!result) process.exit(-1);
};
export const generateDebugAabWhenKeyStoreExists = ({
  keyStoreName,
  keyStorePassword,
}) => {
  console.log("Generating unsigned debug aab");
  generateUnsignedDebugAab();
  console.log("Zip aligning unsigned debug aab");

  zipAlignUnSignedAab({
    unSignedAab: "unSignedDebug.aab",
    alignedUnsignedAabName: "zipAlignedUnSignedDebug.aab",
  });

  generateSignedAab({
    keyStoreFile: keyStoreName,
    signedAabName: "signedDebug.aab",
    unsignedAab: "android/zipAlignedUnSignedDebug.aab",
    password: keyStorePassword,
  });


  cleanupAabsAfterGenerating();
  console.log(" Debug aab : signedDebug.aab is generated")

};

export const generateAabWhenKeyStoreExists = ({
  keyStoreName,
  keyStorePassword,
}) => {
  console.log("Generating unsigned release aab");
  generateUnsignedReleaseAab();
  console.log("Zip aligning unsigned release aab");

  zipAlignUnSignedAab({
    unSignedAab: "unSignedRelease.aab",
    alignedUnsignedAabName: "zipAlignedUnSignedRelease.aab",
  });

  generateSignedAab({
    keyStoreFile: keyStoreName,
    signedAabName: "signedRelease.aab",
    unsignedAab: "android/zipAlignedUnSignedRelease.aab",
    password: keyStorePassword,
  });


  cleanupAabsAfterGenerating();
  console.log(" Debug aab : signedRelease.aab is generated")

};
