import { runCommand } from "../../common.js";
import inquirer from "inquirer";
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
            name: "algorithm",
            message: "Enter Key Algorithm",
        },
        {
            type: "input",
            name: "keysize",
            message: "Enter key size",
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
        if (answers != null &&
            answers["keystore_path"] != null &&
            answers["validity"] != null &&
            answers["alias"] != null &&
            answers["alias_password"] != null &&
            answers["store_pass"] != null &&
            answers["cn"] != null &&
            answers["ou"] != null &&
            answers["org"] != null &&
            answers["country"] != null &&
            answers["algorithm"] != null &&
            answers["keysize"] != null) {
            const generatedDname = `"cn=${answers["cn"]}, ou=${answers["ou"]}, o=${answers["org"]}, c=${answers["country"]}"`;
            // keyStoreName = answers["keystore_path"];
            generateKeyStoreFile({
                alias: answers["alias"],
                aliasPassword: answers["alias_password"],
                dName: generatedDname,
                keyAlgorithm: answers["algorithm"],
                keySize: answers["keysize"],
                keystoreFileName: answers["keystore_path"],
                keyStorepassword: answers["store_pass"],
                validity: answers["validity"],
            });
        }
    })
        .catch((error) => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
        }
        else {
            // Something else went wrong
        }
    });
};
export const generateKeyStoreFile = ({ keystoreFileName, keyAlgorithm, keySize, validity, alias, keyStorepassword, aliasPassword, dName, }) => {
    // dname format is "cn=Mark Jones, ou=JavaSoft, o=Sun, c=US"
    const comm = `keytool -genkey -v -keystore ${keystoreFileName} -keyalg ${keyAlgorithm} -keysize ${keySize} -validity ${validity} -alias ${alias} -storepass ${keyStorepassword} -keypass ${aliasPassword} -dname ${dName}`;
    const result = runCommand(comm);
    if (!result)
        process.exit(-1);
};
//# sourceMappingURL=index.js.map