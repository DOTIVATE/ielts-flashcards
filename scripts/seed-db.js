const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (err) {
  console.error('Failed to read .env.local file. Make sure it exists at the root of your project.');
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
  console.error('Missing Supabase variables in .env.local (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
});

const wordsToSeed = [
  {
    word: 'Aberration',
    definition: 'A departure from what is normal, usual, or expected, typically one that is unwelcome.',
    example: 'The sudden drop in temperature was a meteorological aberration.',
    category: 'Academic'
  },
  {
    word: 'Acquiesce',
    definition: 'Accept something reluctantly but without protest.',
    example: 'He was reluctant to acquiesce to their demands.',
    category: 'Academic'
  },
  {
    word: 'Alleviate',
    definition: 'Make suffering, deficiency, or a problem less severe.',
    example: 'The doctor prescribed medicine to alleviate the patient\'s pain.',
    category: 'Academic'
  },
  {
    word: 'Ambiguous',
    definition: 'Open to more than one interpretation; having a double meaning.',
    example: 'The election result was ambiguous, leading to recounts.',
    category: 'Academic'
  },
  {
    word: 'Benevolent',
    definition: 'Well meaning and kindly.',
    example: 'The benevolent donor funded the new university library.',
    category: 'Academic'
  },
  {
    word: 'Capricious',
    definition: 'Given to sudden and unaccountable changes of mood or behavior.',
    example: 'The administration\'s capricious policies confused the staff.',
    category: 'Academic'
  },
  {
    word: 'Cognizant',
    definition: 'Having knowledge or being aware of.',
    example: 'She was cognizant of the difficulties she would face.',
    category: 'Academic'
  },
  {
    word: 'Delineate',
    definition: 'Describe or portray something precisely.',
    example: 'The report clearly delineates the steps needed for progress.',
    category: 'Academic'
  },
  {
    word: 'Elucidate',
    definition: 'Make something clear; explain.',
    example: 'The scientist wrote a book to elucidate his complex theory.',
    category: 'Academic'
  },
  {
    word: 'Ephemeral',
    definition: 'Lasting for a very short time.',
    example: 'The ephemeral nature of fashion means trends change quickly.',
    category: 'Academic'
  },
  {
    word: 'Equivocal',
    definition: 'Open to more than one interpretation; ambiguous.',
    example: 'The politician gave an equivocal answer to the question.',
    category: 'Academic'
  },
  {
    word: 'Exacerbate',
    definition: 'Make a problem, bad situation, or negative feeling worse.',
    example: 'Running on a sprained ankle will only exacerbate the injury.',
    category: 'Academic'
  },
  {
    word: 'Frugal',
    definition: 'Sparing or economical with regard to money or food.',
    example: 'By being frugal, they managed to save enough for a house deposit.',
    category: 'Academic'
  },
  {
    word: 'Garrulous',
    definition: 'Excessively talkative, especially on trivial matters.',
    example: 'The garrulous passenger kept talking for the entire flight.',
    category: 'Academic'
  },
  {
    word: 'Impetuous',
    definition: 'Acting or done quickly and without thought or care.',
    example: 'His impetuous decision to quit his job left him broke.',
    category: 'Academic'
  },
  {
    word: 'Juxtapose',
    definition: 'Place or deal with close together for contrasting effect.',
    example: 'The exhibition juxtaposes modern art with classical sculptures.',
    category: 'Academic'
  },
  {
    word: 'Lethargic',
    definition: 'Affected by lethargy; sluggish and apathetic.',
    example: 'After a heavy lunch, he felt lethargic and unproductive.',
    category: 'Academic'
  },
  {
    word: 'Meticulous',
    definition: 'Showing great attention to detail; very careful and precise.',
    example: 'The researcher kept meticulous records of all experiments.',
    category: 'Academic'
  },
  {
    word: 'Obfuscate',
    definition: 'Render obscure, unclear, or unintelligible.',
    example: 'The jargon was used to obfuscate the true meaning of the text.',
    category: 'Academic'
  },
  {
    word: 'Pragmatic',
    definition: 'Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.',
    example: 'We need a pragmatic approach rather than an ideological one.',
    category: 'Academic'
  },
  {
    word: 'Resilient',
    definition: 'Able to withstand or recover quickly from difficult conditions.',
    example: 'The local economy proved resilient despite the global recession.',
    category: 'Academic'
  },
  {
    word: 'Scrutinize',
    definition: 'Examine or inspect closely and thoroughly.',
    example: 'The auditor will scrutinize the company\'s financial records.',
    category: 'Academic'
  },
  {
    word: 'Superfluous',
    definition: 'Unnecessary, especially through being more than enough.',
    example: 'Avoid adding superfluous details that distract from your main point.',
    category: 'Academic'
  },
  {
    word: 'Tacit',
    definition: 'Understood or implied without being stated.',
    example: 'There was a tacit agreement that they would help each other.',
    category: 'Academic'
  },
  {
    word: 'Ubiquitous',
    definition: 'Present, appearing, or found everywhere.',
    example: 'Mobile phones have become ubiquitous in modern society.',
    category: 'Academic'
  },
  {
    word: 'Venerate',
    definition: 'Regard with great respect; revere.',
    example: 'Many cultures venerate their ancestors through special rituals.',
    category: 'Academic'
  },
  {
    word: 'Wary',
    definition: 'Feeling or showing caution about possible dangers or problems.',
    example: 'He was wary of signing the contract without reading the terms.',
    category: 'Academic'
  },
  {
    word: 'Zealous',
    definition: 'Having or showing zeal (great energy or enthusiasm).',
    example: 'The zealous volunteer worked tirelessly to raise funds.',
    category: 'Academic'
  },
  {
    word: 'Transient',
    definition: 'Lasting only for a short time; impermanent.',
    example: 'The city has a transient population of students and tourists.',
    category: 'Academic'
  },
  {
    word: 'Assiduous',
    definition: 'Showing great care and perseverance.',
    example: 'She was assiduous in her duties, helping everyone who needed it.',
    category: 'Academic'
  }
];

async function seed() {
  console.log('Connecting to Supabase...');
  try {
    // 1. Fetch existing flashcards
    const { data: existing, error: fetchError } = await supabase
      .from('flashcards')
      .select('word');

    if (fetchError) {
      console.error('Fetch error:', fetchError.message);
      process.exit(1);
    }

    const existingWords = new Set((existing || []).map((c) => c.word.toLowerCase()));
    const toInsert = wordsToSeed.filter((w) => !existingWords.has(w.word.toLowerCase()));

    if (toInsert.length === 0) {
      console.log(`All ${wordsToSeed.length} flashcards already seeded. Total in database: ${existing.length}`);
      process.exit(0);
    }

    console.log(`Found ${toInsert.length} new flashcards to insert. Seeding...`);

    // 2. Bulk insert missing cards
    const { data: inserted, error: insertError } = await supabase
      .from('flashcards')
      .insert(toInsert)
      .select();

    if (insertError) {
      console.error('Insert error:', insertError.message);
      process.exit(1);
    }

    console.log(`Successfully seeded ${inserted.length} new flashcards. Total: ${(existing.length || 0) + inserted.length}`);
  } catch (err) {
    console.error('Unexpected error:', err.message || err);
    process.exit(1);
  }
}

seed();
