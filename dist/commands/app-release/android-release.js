import { runCommand } from "../../common.js";
import fs from "fs";
import { execSync } from "child_process";
import { askUserInfoToGenerateKeyStoreFile } from "../generate-keystore/index.js";
let keyStoreName = "keystore.jks";
export const generateApkWhenKeyStoreExists = ({ keyStoreName, keyStorePassword, generatedApkName, }) => {
    console.log("Generating unsigned release apk");
    generateUnsignedReleaseApk();
    console.log("Zip aligning unsigned release apk");
    zipAlignUnSignedApk({
        unSignedApk: "unSignedRelease.apk",
        alignedUnsignedApkName: "zipAlignedUnSignedRelease.apk",
    });
    generateSignedApk({
        keyStoreFile: keyStoreName,
        signedApkName: generatedApkName,
        unsignedApk: "android/unSignedRelease.apk",
        password: keyStorePassword,
    });
    console.log("verifying release apk ");
    verifySignedApk({ signedApkFile: generatedApkName });
    cleanupAfterGenerating();
    console.log(` Release apk : ${generatedApkName} is generated`);
};
export const generateDebugApkWhenKeyStoreExists = ({ keyStoreName, keyStorePassword, generatedApkName, }) => {
    console.log("Generating unsigned debug apk");
    generateUnsignedDebugApk();
    console.log("Zip aligning unsigned debug apk");
    zipAlignUnSignedApk({
        unSignedApk: "unSignedDebug.apk",
        alignedUnsignedApkName: "zipAlignedUnSignedDebug.apk",
    });
    generateSignedApk({
        keyStoreFile: keyStoreName,
        signedApkName: generatedApkName,
        unsignedApk: "android/unSignedDebug.apk",
        password: keyStorePassword,
    });
    console.log("verifying debug apk ");
    verifySignedApk({ signedApkFile: generatedApkName });
    cleanupAfterGenerating();
    console.log(` Debug apk : ${generatedApkName} is generated`);
};
export const assembleReleaseApkWithoutKeystore = ({ generatedApkName, }) => {
    console.log("Generating unsigned debug apk");
    /* generate debug apk and copy it from android/app/build/outputs/apk/debug to android/ folder */
    let comm = null;
    if (generatedApkName) {
        const debugApkName = generatedApkName.includes(".apk")
            ? generatedApkName
            : generatedApkName + ".apk";
        comm = `cd android && ./gradlew assembleRelease && mv app/build/outputs/apk/release/app-release.apk ../${debugApkName} `;
    }
    else {
        comm = `cd android && ./gradlew assembleRelease && mv app/build/outputs/apk/release/app-release.apk ../debug.apk `;
    }
    const result = runCommand(comm);
    if (!result)
        process.exit(-1);
};
export const assembleDebugApkWithoutKeystore = ({ generatedApkName, }) => {
    console.log("Generating unsigned debug apk");
    /* generate debug apk and copy it from android/app/build/outputs/apk/debug to android/ folder */
    let comm = null;
    if (generatedApkName) {
        const debugApkName = generatedApkName.includes(".apk")
            ? generatedApkName
            : generatedApkName + ".apk";
        comm = `cd android && ./gradlew assembleDebug && mv app/build/outputs/apk/debug/app-debug.apk ../${debugApkName} `;
    }
    else {
        comm = `cd android && ./gradlew assembleDebug && mv app/build/outputs/apk/debug/app-debug.apk ../debug.apk `;
    }
    const result = runCommand(comm);
    if (!result)
        process.exit(-1);
};
export const initialiseApkGeneration = () => {
    const filePath = "keystore.jks";
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(`File ${filePath} does not exist.`);
            askUserInfoToGenerateKeyStoreFile();
            generateApkWhenKeyStoreExists({});
        }
        else {
            console.log(`File ${filePath} exists.`);
            generateApkWhenKeyStoreExists({});
        }
    });
};
const cleanupAfterGenerating = () => {
    const comm = `rm -rf signedDebug.apk.idsig && rm -rf signedRelease.apk.idsig && cd android && rm -rf unSignedRelease.apk && rm -rf zipAlignedUnSignedRelease.apk && rm -rf unSignedDebug.apk && rm -rf zipAlignedUnSignedDebug.apk`;
    const result = runCommand(comm);
    if (!result)
        process.exit(-1);
};
//////////////Apk ////////////////////
export const generateUnsignedDebugApk = () => {
    /* generate debug apk and copy it from android/app/build/outputs/apk/debug to android/unSignedDebugApk.apk */
    const comm = "cd android && ./gradlew assembleDebug && mv app/build/outputs/apk/debug/app-debug.apk unSignedDebug.apk ";
    const result = runCommand(comm);
    if (!result)
        process.exit(-1);
};
export const generateUnsignedReleaseApk = () => {
    const comm = "./gradlew assembleRelease && mv app/build/outputs/apk/release/app-release.apk unSignedRelease.apk";
    execSync(`${comm}`, { cwd: `android` });
};
export const zipAlignUnSignedApk = ({ unSignedApk, alignedUnsignedApkName, }) => {
    const comm = `zipalign -v -p 4 ${unSignedApk} ${alignedUnsignedApkName} `;
    execSync(`${comm}`, { cwd: `android` });
};
export const generateSignedApk = ({ keyStoreFile, signedApkName, unsignedApk, password, }) => {
    const comm = `apksigner sign --ks ${keyStoreFile}  --ks-pass pass:${password}  --out ${signedApkName} ${unsignedApk} `;
    const result = runCommand(comm);
    if (!result)
        process.exit(-1);
};
export const verifySignedApk = ({ signedApkFile, }) => {
    const comm = ` apksigner verify ${signedApkFile}  `;
    const result = runCommand(comm);
    if (!result)
        process.exit(-1);
};
///////////////////Aab/////////////////////
export const generateUnsignedDebugAab = () => {
    const comm = "./gradlew bundleDebug && mv app/build/outputs/bundle/debug/app-debug.aab unSignedDebug.aab";
    execSync(`${comm}`, { cwd: `android` });
};
export const generateDebugAabWithoutKeystore = ({ generatedAabName, }) => {
    console.log("Generating unsigned debug aab");
    /* generate debug apk and copy it from android/app/build/outputs/apk/debug to android/ folder */
    let comm = null;
    if (generatedAabName) {
        const debugAabName = generatedAabName.includes(".aab")
            ? generatedAabName
            : generatedAabName + ".aab";
        comm = `cd android && ./gradlew bundleDebug && mv app/build/outputs/apk/debug/app-debug.aab ../${debugAabName} `;
    }
    else {
        comm = `cd android && ./gradlew bundleDebug && mv app/build/outputs/apk/debug/app-debug.aab ../debug.aab `;
    }
    const result = runCommand(comm);
    if (!result)
        process.exit(-1);
};
export const generateReleaseAabWithoutKeystore = ({ generatedAabName, }) => {
    console.log("Generating unsigned release aab");
    /* generate debug apk and copy it from android/app/build/outputs/apk/debug to android/ folder */
    let comm = null;
    if (generatedAabName) {
        const debugAabName = generatedAabName.includes(".aab")
            ? generatedAabName
            : generatedAabName + ".aab";
        comm = `cd android && ./gradlew bundleRelease && mv app/build/outputs/apk/release/app-release.aab ../${debugAabName} `;
    }
    else {
        comm = `cd android && ./gradlew bundleRelease && mv app/build/outputs/apk/release/app-release.aab ../debug.aab `;
    }
    const result = runCommand(comm);
    if (!result)
        process.exit(-1);
};
export const generateUnsignedReleaseAab = () => {
    const comm = "./gradlew bundleRelease && mv app/build/outputs/bundle/release/app-release.aab unSignedRelease.aab";
    execSync(`${comm}`, { cwd: `android` });
};
export const zipAlignUnSignedAab = ({ unSignedAab, alignedUnsignedAabName, }) => {
    const comm = ` zipalign -v -p 4 ${unSignedAab} ${alignedUnsignedAabName} `;
    execSync(`${comm}`, { cwd: `android` });
};
export const generateSignedAab = ({ keyStoreFile, signedAabName, unsignedAab, password, }) => {
    const comm = `apksigner sign --ks ${keyStoreFile} --min-sdk-version 21 --ks-pass pass:${password} --out ${signedAabName} ${unsignedAab} `;
    const result = runCommand(comm);
    if (!result)
        process.exit(-1);
};
export const verifySignedAab = ({ signedAabFile, }) => {
    const comm = `apksigner verify ${signedAabFile}  `;
    const result = runCommand(comm);
    if (!result)
        process.exit(-1);
};
const cleanupAabsAfterGenerating = () => {
    const comm = `rm -rf signedDebug.aab.idsig && rm -rf signedRelease.aab.idsig && cd android && rm -rf unSignedRelease.aab && rm -rf zipAlignedUnSignedRelease.aab && rm -rf unSignedDebug.aab && rm -rf zipAlignedUnSignedDebug.aab`;
    const result = runCommand(comm);
    if (!result)
        process.exit(-1);
};
export const generateDebugAabWhenKeyStoreExists = ({ keyStoreName, keyStorePassword, generatedAabName, }) => {
    console.log("Generating unsigned debug aab");
    generateUnsignedDebugAab();
    console.log("Zip aligning unsigned debug aab");
    zipAlignUnSignedAab({
        unSignedAab: "unSignedDebug.aab",
        alignedUnsignedAabName: "zipAlignedUnSignedDebug.aab",
    });
    generateSignedAab({
        keyStoreFile: keyStoreName,
        signedAabName: generatedAabName,
        unsignedAab: "android/zipAlignedUnSignedDebug.aab",
        password: keyStorePassword,
    });
    cleanupAabsAfterGenerating();
    console.log(` Debug aab : ${generatedAabName} is generated`);
};
export const generateAabWhenKeyStoreExists = ({ keyStoreName, keyStorePassword, generatedAabName, }) => {
    console.log("Generating unsigned release aab");
    generateUnsignedReleaseAab();
    console.log("Zip aligning unsigned release aab");
    zipAlignUnSignedAab({
        unSignedAab: "unSignedRelease.aab",
        alignedUnsignedAabName: "zipAlignedUnSignedRelease.aab",
    });
    generateSignedAab({
        keyStoreFile: keyStoreName,
        signedAabName: generatedAabName,
        unsignedAab: "android/zipAlignedUnSignedRelease.aab",
        password: keyStorePassword,
    });
    cleanupAabsAfterGenerating();
    console.log(`Debug aab : ${generatedAabName} is generated`);
};
//# sourceMappingURL=android-release.js.map