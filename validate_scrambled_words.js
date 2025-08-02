// Validation script to ensure scrambled words contain exactly the same letters as original words
const fs = require('fs');

// Read the quotes file
const quotesContent = fs.readFileSync('quotes_calendar.js', 'utf8');

// Extract the quotesCalendar array
const quotesMatch = quotesContent.match(/const quotesCalendar = (\[[\s\S]*?\]);/);
if (!quotesMatch) {
    console.error('Could not find quotesCalendar array');
    process.exit(1);
}

let quotes;
try {
    quotes = eval(quotesMatch[1]);
} catch (error) {
    console.error('Error parsing quotes:', error);
    process.exit(1);
}

console.log(`Validating scrambled words for ${quotes.length} quotes...`);

function normalizeString(str) {
    return str.toLowerCase().replace(/[^a-z]/g, '').split('').sort().join('');
}

function validateScrambledWord(original, scrambled) {
    const originalNormalized = normalizeString(original);
    const scrambledNormalized = normalizeString(scrambled);
    return originalNormalized === scrambledNormalized;
}

function generateValidScramble(word) {
    const letters = word.toLowerCase().split('');
    
    // Fisher-Yates shuffle
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    
    const scrambled = letters.join('');
    
    // If scrambled is the same as original, try again (unless it's a single letter)
    if (scrambled === word.toLowerCase() && word.length > 1) {
        return generateValidScramble(word);
    }
    
    return scrambled;
}

let issuesFound = 0;
let fixedQuotes = [];

quotes.forEach((quote, quoteIndex) => {
    let quoteHasIssues = false;
    let fixedQuote = { ...quote };
    
    // Validate scrambled words
    if (quote.scrambledWords) {
        let fixedScrambledWords = [];
        
        quote.scrambledWords.forEach((wordData, wordIndex) => {
            const isValid = validateScrambledWord(wordData.original, wordData.scrambled);
            
            if (!isValid) {
                console.log(`❌ Quote ${quoteIndex + 1}: Word "${wordData.original}" scrambled as "${wordData.scrambled}" - INVALID`);
                console.log(`   Original letters: ${normalizeString(wordData.original)}`);
                console.log(`   Scrambled letters: ${normalizeString(wordData.scrambled)}`);
                
                // Generate a valid scramble
                const newScramble = generateValidScramble(wordData.original);
                console.log(`   Fixed scramble: ${newScramble}`);
                
                fixedScrambledWords.push({
                    ...wordData,
                    scrambled: newScramble
                });
                
                issuesFound++;
                quoteHasIssues = true;
            } else {
                fixedScrambledWords.push(wordData);
            }
        });
        
        fixedQuote.scrambledWords = fixedScrambledWords;
    }
    
    // Validate scrambled author
    if (quote.scrambledAuthor) {
        const isValid = validateScrambledWord(quote.author, quote.scrambledAuthor);
        
        if (!isValid) {
            console.log(`❌ Quote ${quoteIndex + 1}: Author "${quote.author}" scrambled as "${quote.scrambledAuthor}" - INVALID`);
            console.log(`   Original letters: ${normalizeString(quote.author)}`);
            console.log(`   Scrambled letters: ${normalizeString(quote.scrambledAuthor)}`);
            
            // Generate a valid scramble
            const newScramble = generateValidScramble(quote.author);
            console.log(`   Fixed scramble: ${newScramble}`);
            
            fixedQuote.scrambledAuthor = newScramble;
            
            issuesFound++;
            quoteHasIssues = true;
        }
    }
    
    if (quoteHasIssues) {
        console.log(`   Quote: "${quote.text}" - ${quote.author}`);
        console.log('');
    }
    
    fixedQuotes.push(fixedQuote);
});

console.log(`\n=== VALIDATION SUMMARY ===`);
console.log(`Total quotes checked: ${quotes.length}`);
console.log(`Issues found: ${issuesFound}`);

if (issuesFound > 0) {
    console.log(`\nGenerating fixed quotes file...`);
    
    // Generate the fixed quotes file content
    const fixedContent = `// Daily Quote Puzzle - Calendar Quotes Database
// Each quote includes the original text, author, scrambled words, and scrambled author name

const quotesCalendar = ${JSON.stringify(fixedQuotes, null, 4)};

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = quotesCalendar;
}
`;

    // Write the fixed file
    fs.writeFileSync('quotes_calendar_fixed.js', fixedContent);
    console.log('Fixed quotes saved to: quotes_calendar_fixed.js');
    console.log('\nPlease review the fixes and replace the original file if they look correct.');
} else {
    console.log('✅ All scrambled words are valid! No fixes needed.');
}