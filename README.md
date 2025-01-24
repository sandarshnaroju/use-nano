# USE-NANO

## Description
Npx Cli tool to create and work with `react-native-nano`

## Commands

### `init`
```
# for latest versions
npx use-nano init MyNewProject


# for specific react-native-nano version and react-native version
npx rn-nano init MyFirstNanoProject --nano-version 1.0.162 --react-native-version 0.72.6  


# To setup sync enabled project via single command
npx use-nano init MyNewProject --app-id <appId> --app-secret <appSecret> --app-url <appUrl>

```
### `rename`
```
# To rename existing react-native-nano project
npx use-nano rename <new name>
```

### `launcher-icon`
To set launcher icon of react-native-nano project
```
npx use-nano launcher-icon create ./path/to/icon.png
```

### `icons`
To setup react-native-vector-icons natively in react-native-nano project
```
npx use-nano icons android 
```


### `generate-keystore-file`


```
# To generate a keystore file 
npx use-nano generate-keystore-file
```

### `generate-apk`
```
# To generate a release apk file 
 
npx use-nano generate-apk release --keystore <keystore file path> --keystore-password <keystore password> --generated-apk <name.apk> 
```

```
# To generate a debug apk file 
 
npx use-nano generate-apk debug --keystore <keystore file path> --keystore-password <keystore password> --generated-apk <name.apk> 
```
If `keystore` and `--keystore-password` are not provided then an unsigned apk is generated

### `generate-aab`
```
# To generate a release aab file 
 
npx use-nano generate-aab release --keystore <keystore file path> --keystore-password <keystore password> --generated-apk <name.aab> 
```

```
# To generate a debug aab file 
 
npx use-nano generate-aab debug --keystore <keystore file path> --keystore-password <keystore password> --generated-aab <name.aab> 
```
If `keystore` and `--keystore-password` are not provided then an unsigned aab is generated


### `build`
To setup project and generate signed apk/aab in one command

```
# for release
npx use-nano build --name <newname> --launchericon <launcherIconPath> --keystorefile <keystore file> --generate-apk release --keystore-password <keystore password> --generated-apk-name <final apk name>

# for debug
npx use-nano build --name <newname> --launchericon <launcherIconPath> --keystorefile <keystore file> --generate-apk debug --keystore-password <keystore password> --generated-apk-name <final apk name>

```

### `md-to-pdf`

To convert documentation to a pdf. Can also use regex to replace matching strings


```
npx use-nano md-to-pdf <path to documentation> <path for output pdf> --regex-pattern <regex pattern to search for> --regex-flag <regex flag to use> --replacement <replacement string>
```
### `configure`
Will change the paramters in an existing sync enabled `react-native-nano`` project

```
npx use-nano configure --app-id <appId> --app-secret <appSecret> --app-url <appUrl>

```

### `project`

```
npx use-nano project --screen <base64> --assets <base64> --packages <base64> 
    
```

### `version`

```
npx use-nano version --name <string> --version-code <integer> --version-name <string>
    
```