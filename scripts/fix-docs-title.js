import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DOCS_DIR = './out-docs';
const NEW_TITLE_PREFIX = 'Computer Parts Shop | ';
const MAIN_TITLE = 'Computer Parts Shop - Documentation';

/**
 * Recursively find and update HTML files in the docs directory
 * @param {string} dir - The directory to walk through.
 */
function updateHTMLTitles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            updateHTMLTitles(filePath);
        } else if (file.endsWith('.html')) {
            updateHTMLFile(filePath);
        }
    }
}

/**
 * Update title and headings in a single HTML file
 * @param {string} filePath - Path to the HTML file.
 */
function updateHTMLFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Replace the <title> tag (generic for all pages)
    // "JSDoc: Home" -> "Computer Parts Shop | Home"
    // "JSDoc: Global" -> "Computer Parts Shop | Global"
    let updatedContent = content.replace(
        /<title>JSDoc: (.*?)<\/title>/g,
        `<title>${NEW_TITLE_PREFIX}$1</title>`
    );
    
    // 2. Also update page title heading if it's the home page
    if (path.basename(filePath) === 'index.html') {
        updatedContent = updatedContent.replace(
            '<h1 class="page-title">Home</h1>',
            `<h1 class="page-title">${MAIN_TITLE}</h1>`
        );
    }
    
    if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`✅ Updated: ${filePath}`);
    }
}

// Run if called directly
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
    console.log('🔧 Fixing documentation titles...');
    
    if (!fs.existsSync(DOCS_DIR)) {
        console.error(`❌ Documentation directory '${DOCS_DIR}' not found`);
        process.exit(1);
    }
    
    updateHTMLTitles(DOCS_DIR);
    console.log('✅ Documentation titles updated successfully');
}
