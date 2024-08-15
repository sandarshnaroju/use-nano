import fs from "fs";
import path from "path";
import { runCommand } from "../../common.js";
async function traverseDir(dirPath) {
    const result = {};
    let folderPosition = null;
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            const s = await traverseDir(fullPath);
            if (s && s[1] && s[0]) {
                result[s[1]] = s[0];
            }
        }
        else if (entry.isFile()) {
            if (entry.name.endsWith(".md")) {
                const content = await fs.promises.readFile(fullPath, "utf-8");
                const match = content.match(/sidebar_position:\s*(\d+)/);
                let pos = match ? parseInt(match[1], 10) : 1;
                result[pos] = fullPath;
            }
            else if (entry.name.endsWith(".json")) {
                const data = JSON.parse(await fs.promises.readFile(fullPath, "utf-8"));
                const pos = data.position || 1;
                folderPosition = pos;
            }
        }
    }
    return [result, folderPosition];
}
function removeSidebarPosition(frontMatterString) {
    const pattern = /^---\n(?:[^-]*\n)?sidebar_position: \d+\n(?:[^-]*\n)?---\n/m;
    const result = frontMatterString.replace(pattern, "");
    return result;
}
const appendContentToFile = async (pathObj, fileName = "final.md") => {
    const sortedObjectKeysArr = Object.keys(pathObj).sort((a, b) => parseInt(a) - parseInt(b));
    for (let index = 0; index < sortedObjectKeysArr.length; index++) {
        const key = sortedObjectKeysArr[index];
        if (pathObj[key]) {
            if (typeof pathObj[key] == "string") {
                fs.appendFileSync(fileName, `\n`, "utf-8");
                const cleanedString = removeSidebarPosition(fs.readFileSync(pathObj[key]).toString());
                fs.appendFileSync(fileName, cleanedString, "utf-8");
                fs.appendFileSync(fileName, `\n`, "utf-8");
            }
            else if (typeof pathObj[key] === "object") {
                appendContentToFile(pathObj[key], fileName);
            }
        }
    }
};
export const convertDocsToPdf = ({ dirPath, resultPdfName = "final", restArgs = " ", }) => {
    traverseDir(dirPath)
        .then(async (result) => {
        if (result && result[0]) {
            const resObj = result[0];
            if (resultPdfName.includes(".pdf")) {
                resultPdfName = resultPdfName.slice(0, -4);
            }
            appendContentToFile(resObj, resultPdfName + ".md");
            if (fs.existsSync(resultPdfName + ".md")) {
                const result = runCommand(`npx md-to-pdf ${resultPdfName}.md ${restArgs}`);
                if (!result)
                    process.exit(-1);
            }
        }
    })
        .catch((err) => console.error("Error traversing directory:", err));
};
//# sourceMappingURL=md-to-pdf.js.map