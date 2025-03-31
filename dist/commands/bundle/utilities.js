import { readFileSync, writeFileSync } from "fs";
import path from "path";
export function objectToString(obj, indent = 2) {
    const spacing = " ".repeat(indent);
    let str = "{\n";
    const entries = Object.entries(obj);
    for (let i = 0; i < entries.length; i++) {
        const [key, value] = entries[i];
        str += `${spacing}${key}: `;
        if (value instanceof RegExp) {
            str += value.toString();
        }
        else if (typeof value === "object" && value !== null && !value.length) {
            // Object
            str += objectToString(value, indent + 2);
        }
        else if (typeof value === "object" &&
            value !== null &&
            value.length > 0) {
            // Array
            let temp = "";
            value.forEach((val) => {
                if (typeof val === "object" && val !== null && !val.length) {
                    str += objectToString(val, indent + 2);
                }
                else if (typeof val === "string") {
                    temp += `'${val}',`;
                }
            });
            if (temp.length > 0) {
                str += "[" + temp + "]";
            }
        }
        else if (typeof value === "string") {
            if (value.includes("resolve")) {
                str += `${value}`;
            }
            else {
                str += `'${value}'`;
            }
        }
        else {
            str += value;
        }
        if (i < entries.length - 1)
            str += ",";
        str += "\n";
    }
    str += " ".repeat(indent - 2) + "}";
    return str;
}
export function addRulesInWebpack(libRules, repoName) {
    try {
        const configPath = path.resolve(repoName, "webpack.config.js");
        let config = readFileSync(configPath, "utf-8");
        const importsString = config.slice(0, config.indexOf("module.exports = {"));
        const exportModules = config.slice(config.indexOf("module.exports = {"));
        const stringTillResolve = exportModules.slice(0, exportModules.indexOf("resolve:"));
        const stringAfterResolve = exportModules.slice(exportModules.indexOf("resolve:"));
        const moduleExportsToLastExistingRules = stringTillResolve.slice(0, stringTillResolve.lastIndexOf("],") - 1);
        let stringifiedRules = "";
        libRules.forEach((rule) => {
            stringifiedRules += objectToString(rule) + ", \n";
        });
        const modifiedConfig = `${importsString} \n ${moduleExportsToLastExistingRules} \n ${stringifiedRules} \n ], \n }, \n ${stringAfterResolve}`;
        writeFileSync(configPath, modifiedConfig);
    }
    catch (error) {
        console.error("Error:", error);
    }
}
export function addAliasToWebPack(aliasObject, repoName) {
    const configPath = path.resolve(repoName, "webpack.config.js");
    let config = readFileSync(configPath, "utf-8");
    const stringTillExtensions = config.slice(0, config.indexOf("extensions:"));
    const stringAfterExtensions = config.slice(config.indexOf("extensions:"));
    // const alias = extractAliasFromRulesConfig(rulesConfigPath, "alias");
    const stringTillAlias = stringTillExtensions.slice(0, stringTillExtensions.lastIndexOf("},") - 1);
    let stringifiedAlias = "";
    Object.entries(aliasObject).forEach(([key, value]) => {
        if (value.includes("resolve")) {
            stringifiedAlias += `"${key}": ${value}, \n`;
        }
        else {
            stringifiedAlias += `"${key}": "${value}", \n`;
        }
    });
    const modifiedConfig = `${stringTillAlias} \n ${stringifiedAlias} \n }, \n ${stringAfterExtensions}`;
    writeFileSync(configPath, modifiedConfig);
}
export function serializeWithRegex(obj) {
    return JSON.stringify(obj, (key, value) => value instanceof RegExp ? value.toString() : value);
}
export function parseWithSpecialCases(json) {
    return JSON.parse(json, (key, value) => {
        if (typeof value === "string") {
            if (value.startsWith("__REGEXP__:")) {
                const match = value.substring(11).match(/^\/(.*)\/([gimsuy]*)$/);
                return match ? new RegExp(match[1], match[2]) : value;
            }
            if (value.startsWith("__PATH__:")) {
                return value.substring(9);
            }
        }
        return value;
    });
}
//# sourceMappingURL=utilities.js.map