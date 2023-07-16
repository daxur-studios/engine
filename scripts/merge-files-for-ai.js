"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var folderPath = './dist/ai';
// Create empty folder at `dist\ai`, if already exists, delete it and recreate it
if (fs.existsSync(folderPath)) {
    fs.rmdirSync(folderPath, { recursive: true });
}
fs.mkdirSync(folderPath);
// Get all files in `dist\ai` folder
var files = fs.readdirSync('./dist/ai');
// Get all files in `projects\daxur-studios\engine\src\lib\models`
var models = fs.readdirSync('./projects/daxur-studios/engine/src/lib/models');
// Create a new file in `dist\ai` that will contain the merged content from each file in `projects\daxur-studios\engine\src\lib\models`
var mergedFile = fs.createWriteStream('./dist/ai/merged.ts');
// Write the import statement for each file in `projects\daxur-studios\engine\src\lib\models`
models.forEach(function (model) {
    mergedFile.write("import * as ".concat(model.replace('.ts', ''), " from './").concat(model, "';\n"));
});
// Write the export statement for each file in `projects\daxur-studios\engine\src\lib\models`
models.forEach(function (model) {
    mergedFile.write("export { ".concat(model.replace('.ts', ''), " } from './").concat(model, "';\n"));
});
// Close the file
mergedFile.end();
