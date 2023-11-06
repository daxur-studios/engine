import * as fs from 'fs';
import * as path from 'path';

const base = './projects/daxur-studios/engine/src';
const distBase = './dist/ai';

const ignoreFolders = new Set(['node_modules', '.angular', 'dist']);

//#region Clean directory before starting the merge
// Clean the dist/ai directory before starting the merge
cleanDirectory(distBase);

// Ensure the distBase exists
if (!fs.existsSync(distBase)) {
  fs.mkdirSync(distBase, { recursive: true });
}
//#endregion

// Start the recursive merge process from the base directory
mergeFiles(base, distBase);

function mergeFiles(baseFolder: string, distFolder: string) {
  console.log(`🐲 STARTING FILE MERGE IN ${baseFolder} 🐲`);

  // Ensure the distFolder exists
  if (!fs.existsSync(distFolder)) {
    fs.mkdirSync(distFolder, { recursive: true });
  }

  // Get all files and directories in srcFolder
  const entries = getFilesAndDirectories(baseFolder);

  // Filter the entries for files that match the specified extensions
  const files = entries.filter((entry) =>
    /\.(html|css|scss|ts|json)$/.test(entry.name)
  );

  // Create a merged file path
  const mergedFileName = `${path.basename(baseFolder)}.ai`;
  const mergedFilePath = path.join(distFolder, mergedFileName);
  const mergedFile = fs.createWriteStream(mergedFilePath);

  // Write the content of each file
  files.forEach((file) => {
    const filePath = path.join(baseFolder, file.name);
    let content = fs.readFileSync(filePath, 'utf8');

    // Minify the content based on file type
    content = minifyCode(content);

    // Make the path relative
    const relativePath = `./${path.basename(filePath)}`;

    // Write the file path and content enclosed in triple backticks, each on new lines
    mergedFile.write(`\n${relativePath}\n\`\`\`\n`);
    mergedFile.write(content);
    mergedFile.write(`\n\`\`\`\n`);
  });

  function minifyCode(input: string): string {
    // Remove single line comments
    let result = input.replace(/\/\/.*$/gm, '');

    // Remove new lines and line breaks
    result = result.replace(/(\r\n|\n|\r)/gm, '');

    // Remove multiple white spaces with single space
    result = result.replace(/\s+/g, ' ');

    // Remove spaces before and after certain characters
    result = result.replace(/\s*([{};])\s*/g, '$1');

    // Optional: Remove last semicolon before closing brace for an even smaller output
    result = result.replace(/;}/g, '}');

    return result;
  }

  // Close file
  mergedFile.end();

  // Log stats
  console.log(`🐲 ${files.length} files merged into ${mergedFilePath}`);

  // Recursively call mergeFiles for each directory that is not ignored
  const directories = entries.filter(
    (entry) => entry.isDirectory && !ignoreFolders.has(entry.name)
  );
  directories.forEach((dir) => {
    const srcDirPath = path.join(baseFolder, dir.name);
    const distDirPath = path.join(distFolder, dir.name);
    mergeFiles(srcDirPath, distDirPath);
  });
}

function getFilesAndDirectories(dir: string) {
  const results: { name: string; isDirectory: boolean }[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach((entry) => {
    if (!ignoreFolders.has(entry.name)) {
      results.push({
        name: entry.name,
        isDirectory: entry.isDirectory(),
      });
    }
  });

  return results;
}

function cleanDirectory(directoryPath: string) {
  if (fs.existsSync(directoryPath)) {
    fs.rmSync(directoryPath, { recursive: true, force: true });
    console.log(`🧹 Cleaned directory: ${directoryPath}`);
  }
  fs.mkdirSync(directoryPath, { recursive: true });
}
