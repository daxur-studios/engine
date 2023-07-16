import * as fs from 'fs';

const folderPath = './dist/ai';

// Create empty folder at `dist\ai`, if already exists, delete it and recreate it
if (fs.existsSync(folderPath)) {
  fs.rmdirSync(folderPath, { recursive: true });
}
fs.mkdirSync(folderPath);

// Get all files in `dist\ai` folder
const files = fs.readdirSync('./dist/ai');

// Get all files in `projects\daxur-studios\engine\src\lib\models`
const models = fs.readdirSync('./projects/daxur-studios/engine/src/lib/models');

// Create a new file in `dist\ai` that will contain the merged content from each file in `projects\daxur-studios\engine\src\lib\models`
const mergedFile = fs.createWriteStream('./dist/ai/merged.ts');

// Write the import statement for each file in `projects\daxur-studios\engine\src\lib\models`
models.forEach((model) => {
  mergedFile.write(
    `import * as ${model.replace('.ts', '')} from './${model}';\n`
  );
});

// Write the export statement for each file in `projects\daxur-studios\engine\src\lib\models`
models.forEach((model) => {
  mergedFile.write(
    `export { ${model.replace('.ts', '')} } from './${model}';\n`
  );
});

// Close the file
mergedFile.end();
