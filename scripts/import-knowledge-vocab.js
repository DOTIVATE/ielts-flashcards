const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.join(__dirname, '..', 'knowledge (update it with more verbs and prepo).html');
const envPath = path.join(__dirname, '..', '.env.local');

console.log('Reading HTML file...');
let htmlContent = '';
try {
  htmlContent = fs.readFileSync(htmlPath, 'utf8');
} catch (err) {
  console.error('Failed to read the HTML file. Ensure it is at the root of your project.');
  process.exit(1);
}

// 1. Extract the FLASH_TOPICS javascript block
console.log('Parsing FLASH_TOPICS from HTML...');
const startMarker = 'const FLASH_TOPICS = {';
const endMarker = '};';

const startIdx = htmlContent.indexOf(startMarker);
if (startIdx === -1) {
  console.error('Could not find start of FLASH_TOPICS constant in HTML.');
  process.exit(1);
}

// Find the matching closing brace. Since we know let currentFlashTopic follows it, we can find the next };
const endIdx = htmlContent.indexOf('let currentFlashTopic', startIdx);
if (endIdx === -1) {
  console.error('Could not find end of FLASH_TOPICS constant.');
  process.exit(1);
}

// Grab the javascript code for the object declaration
const objectCode = htmlContent.slice(startIdx, htmlContent.lastIndexOf('}', endIdx) + 1);

// Evaluate the object code in a sandboxed context
const context = {};
vm.createContext(context);
try {
  const runnableCode = objectCode.replace('const FLASH_TOPICS =', 'this.FLASH_TOPICS =');
  vm.runInContext(runnableCode, context);
} catch (err) {
  console.error('Error evaluating object code:', err);
  process.exit(1);
}

const flashTopics = context.FLASH_TOPICS;
if (!flashTopics) {
  console.error('Failed to evaluate and retrieve FLASH_TOPICS.');
  process.exit(1);
}

// 2. Parse environment variables
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (err) {
  console.error('Failed to read .env.local file.');
  process.exit(1);
}

const env = {};
envContent.split('\n').forEach((line) => {
  const cleanLine = line.trim();
  if (cleanLine && !cleanLine.startsWith('#')) {
    const parts = cleanLine.split('=');
    if (parts.length >= 2) {
      env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
});

// 3. Flatten and map the words list
const wordsToInsert = [];
Object.entries(flashTopics).forEach(([topicKey, list]) => {
  const defaultCategory = topicKey.charAt(0).toUpperCase() + topicKey.slice(1);
  
  list.forEach((item) => {
    if (!item.word || !item.meaning || !item.sentence) {
      console.warn(`Skipping invalid item in topic ${topicKey}:`, item);
      return;
    }

    wordsToInsert.push({
      word: item.word.trim(),
      definition: item.meaning.trim(),
      example: item.sentence.trim(),
      category: (item.category || defaultCategory).trim(),
    });
  });
});

console.log(`Parsed ${wordsToInsert.length} total words from HTML knowledge base.`);

// 4. Seeding/Upserting to Supabase
async function runImport() {
  console.log('Connecting to Supabase...');
  try {
    // Fetch existing flashcards
    const { data: existing, error: fetchError } = await supabase
      .from('flashcards')
      .select('word');

    if (fetchError) {
      console.error('Fetch error:', fetchError.message);
      process.exit(1);
    }

    const existingWords = new Set((existing || []).map((c) => c.word.toLowerCase()));
    
    // Filter out duplicates (case-insensitive check on word)
    const uniqueToInsert = [];
    const seenLocal = new Set();
    
    wordsToInsert.forEach((w) => {
      const lowerWord = w.word.toLowerCase();
      if (!existingWords.has(lowerWord) && !seenLocal.has(lowerWord)) {
        uniqueToInsert.push(w);
        seenLocal.add(lowerWord);
      }
    });

    if (uniqueToInsert.length === 0) {
      console.log(`All parsed flashcards already seeded. Total in database: ${existing.length}`);
      process.exit(0);
    }

    console.log(`Inserting ${uniqueToInsert.length} new flashcards to Supabase...`);

    // Bulk insert in chunks of 100 to avoid request body size limits
    const chunkSize = 100;
    let insertedCount = 0;
    
    for (let i = 0; i < uniqueToInsert.length; i += chunkSize) {
      const chunk = uniqueToInsert.slice(i, i + chunkSize);
      const { data: inserted, error: insertError } = await supabase
        .from('flashcards')
        .insert(chunk)
        .select();

      if (insertError) {
        console.error(`Insert error at chunk ${i}:`, insertError.message);
        process.exit(1);
      }
      insertedCount += inserted.length;
      console.log(`Inserted chunk ${i / chunkSize + 1} (${inserted.length} cards)...`);
    }

    console.log(`Import completed successfully! Seeded ${insertedCount} new cards. Total: ${(existing.length || 0) + insertedCount}`);
  } catch (err) {
    console.error('Unexpected error:', err.message || err);
    process.exit(1);
  }
}

runImport();
