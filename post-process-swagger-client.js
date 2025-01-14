const fs = require("fs");
const path = require("path");

const directory = path.join(__dirname, "frontend/generated-api");
const replacementsConfigPath = path.join(
  __dirname,
  "swagger-codegen-typemappings.json"
);

// Read replacements from the configuration file
const replacements = JSON.parse(
  fs.readFileSync(replacementsConfigPath, "utf8")
);

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, "utf8");
  for (const [oldValue, newValue] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${oldValue}\\b`, "g");
    content = content.replace(regex, newValue);
  }
  fs.writeFileSync(filePath, content, "utf8");
}

function processDirectory(directory, replacements) {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const filePath = path.join(directory, file);
    if (fs.statSync(filePath).isDirectory()) {
      processDirectory(filePath, replacements);
    } else if (filePath.endsWith(".ts")) {
      replaceInFile(filePath, replacements);
    }
  });
}

processDirectory(directory, replacements);
console.log("Post-processing completed.");
