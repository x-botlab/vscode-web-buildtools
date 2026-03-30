import fs from "fs";
import path from "path";


export const makeNls = async (workDir: string): Promise<void> => {
  const vscodeWebDir = path.join(workDir, "vscode-web");
  const nlsDir = path.join(workDir, "nls");
  const nlsOutputDir = path.join(workDir, "nls-out");

  const nlsKeysPath = path.join(vscodeWebDir, "out", "nls.keys.json");
  const nlsMessagesPath = path.join(vscodeWebDir, "out", "nls.messages.json");

  if (!fs.existsSync(nlsKeysPath) || !fs.existsSync(nlsMessagesPath)) {
    console.error("nls.keys.json or nls.messages.json not found in vscode-web output directory. Please run the compile command first.");
    process.exit(1);
  }

  if (!fs.existsSync(nlsDir)) {
    console.error("nls directory not found. Please make sure to place your nls source files in the nls directory.");
    process.exit(1);
  }

  // [["module1",["key1","key2",...]],["module2",["key1","key2",...]],...]
  const nlsKeys = JSON.parse(fs.readFileSync(nlsKeysPath, "utf-8")) as [string, string[]][];
  // ["message1","message2",...]
  const nlsMessages = JSON.parse(fs.readFileSync(nlsMessagesPath, "utf-8"));

  // Scan nlsDir for {locale}.json files and generate corresponding {locale}/nls.messages.js files
  fs.readdirSync(nlsDir).forEach(file => {
    if (file.endsWith(".json")) {
      const locale = path.basename(file, ".json");
      const localeOutputDir = path.join(nlsOutputDir, locale);
      if (!fs.existsSync(localeOutputDir)) {
        fs.mkdirSync(localeOutputDir, { recursive: true });
      }

      const nlsSourcePath = path.join(nlsDir, file);
      // { "contents": { "module1": { "key1": "message1", ... }, ... } }
      const nlsSource = JSON.parse(fs.readFileSync(nlsSourcePath, "utf-8"));

      // ["message1","message2",...]

      const nlsTranslatedMessages = [] as string[];
      nlsKeys.forEach(([moduleName, keys]) => {
        keys.forEach(key => {
          nlsSource.contents[moduleName] = nlsSource.contents[moduleName] || {};
          const message = nlsSource.contents[moduleName][key] || nlsMessages[nlsTranslatedMessages.length] || "";
          nlsTranslatedMessages.push(message);
        })
      });

      const outputPath = path.join(localeOutputDir, "nls.messages.js");
      fs.writeFileSync(outputPath, `globalThis._VSCODE_NLS_MESSAGES=${JSON.stringify(nlsTranslatedMessages)};\nglobalThis._VSCODE_NLS_LANGUAGE=${JSON.stringify(locale)};`, "utf-8");
      console.log(`Generated ${outputPath}`);
    }
  });
}
