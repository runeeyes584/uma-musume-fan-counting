import Tesseract from 'tesseract.js';

export interface ParsedStats {
    name?: string;
    totalRaces?: number;
    totalWins?: number;
    totalFan?: number;
    date?: string;
}

// Preprocess image to improve OCR accuracy
// Converts to grayscale and increases contrast
const preprocessImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(img.src); // Fallback to original
                return;
            }

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Simple Grayscale & High Contrast
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                // Luminance
                const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;

                // Binarize / High Contrast threshold
                // const val = gray > 180 ? 255 : 0; 

                data[i] = gray;
                data[i + 1] = gray;
                data[i + 2] = gray;
            }

            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL('image/jpeg'));
        };
    });
};

export const processImage = async (file: File): Promise<ParsedStats> => {
    try {
        // Run OCR
        // We might want to pass the original file if preprocessing is risky without testing, 
        // but preprocessing usually helps. Let's try raw Tesseract first with better Regex,
        // as the user said "Can you handle it in logic?".
        // If the user said it failed, maybe the text wasn't recognized AT ALL. 
        // Let's try to trust Tesseract's internal binarization but improve the regex first.

        // Use preprocess:
        // const processedImageSrc = await preprocessImage(file);

        const { data: { text } } = await Tesseract.recognize(
            file,
            'eng',
            { logger: m => console.log(m) }
        );

        console.log('OCR Raw Text:', text);
        return parseStats(text);
    } catch (error) {
        console.error('OCR Error:', error);
        throw error;
    }
};

const parseStats = (text: string): ParsedStats => {
    const stats: ParsedStats = {};
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);

    // Helper: Find line containing keywords
    const findLine = (keywords: string[]) => lines.find(l => keywords.every(k => l.toLowerCase().includes(k.toLowerCase())));

    // 1. Parse Races and Wins
    // "Career Record Races: 13 Wins: 12"
    // Regex: look for numbers after "Races" and "Wins"
    const racesMatch = text.match(/Races[:\s]*(\d+)/i);
    const winsMatch = text.match(/Wins[:\s]*(\d+)/i);

    if (racesMatch) stats.totalRaces = parseInt(racesMatch[1], 10);
    if (winsMatch) stats.totalWins = parseInt(winsMatch[1], 10);

    // 2. Parse Fans
    // "Fans Earned 337,556"
    // Sometimes OCR reads "Fans Earned" as "Fans Eamed" or similar.
    // Look for "Fans" and then a large number
    const fansLine = findLine(['Fans', 'Earned']) || findLine(['Fans']);
    if (fansLine) {
        // Extract the first large number pattern (digits with optional commas)
        const numMatch = fansLine.match(/([\d,]+)/g);
        if (numMatch) {
            // Filter for something that looks like a fan count (usually > 1000 or has comma)
            const validNum = numMatch.find(n => n.length > 3 || n.includes(','));
            if (validNum) {
                stats.totalFan = parseInt(validNum.replace(/,/g, ''), 10);
            }
        }
    }

    // 3. Parse Date
    // "Date Acquired Nov 21, 2025"
    // Look for Month names
    const monthRegex = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}/i;
    const dateMatch = text.match(monthRegex);
    if (dateMatch) {
        // Standardize to YYYY-MM-DD for the form input
        const dateObj = new Date(dateMatch[0]);
        if (!isNaN(dateObj.getTime())) {
            stats.date = dateObj.toISOString().split('T')[0];
        }
    }

    // 4. Name Parsing
    // Strategy: Look for the line containing brackets [], typically "[Title] Name"
    const bracketLine = lines.find(l => l.includes('[') && l.includes(']'));
    if (bracketLine) {
        // Extract text after the closing bracket
        const parts = bracketLine.split(']');
        if (parts.length > 1) {
            stats.name = parts[1].trim();
        }
    } else {
        // Fallback: Look for "Epithet" lines? 
        // Or just take the first line that isn't empty, often the title/name is top.
        // But in the screenshot, "Umamusume Details" is top.
        // "Rice Shower" is large text. 
        // Let's rely on the bracket logic for now as it's most distinctive for this game.
    }

    return stats;
};
