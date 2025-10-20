/* eslint-disable no-undef */

// Load environment variables using dotenv
// const dotenv = require('dotenv')
// dotenv.config()

// Securely store the MangaDX API key
const MANGA_DEX_SECRET = null;

// Title similarity functions for background script
const normalizeTitle = (title) => {
    if (!title) return '';
    return title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
};

const titlesSimilar = (title1, title2, threshold = 0.75) => {
    const norm1 = normalizeTitle(title1);
    const norm2 = normalizeTitle(title2);
    
    if (norm1 === norm2) return true;
    if (norm1.length === 0 || norm2.length === 0) return false;
    
    if (norm1.includes(norm2) || norm2.includes(norm1)) {
        const longer = norm1.length > norm2.length ? norm1 : norm2;
        const shorter = norm1.length > norm2.length ? norm2 : norm1;
        return shorter.length / longer.length >= threshold;
    }
    
    const words1 = norm1.split(' ').filter(w => w.length > 2);
    const words2 = norm2.split(' ').filter(w => w.length > 2);
    
    if (words1.length === 0 || words2.length === 0) return false;
    
    const commonWords = words1.filter(word => words2.includes(word));
    const similarity = commonWords.length / Math.max(words1.length, words2.length);
    
    return similarity >= threshold;
};

const calculateSimilarity = (str1, str2) => {
    if (str1 === str2) return 1.0;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    let matches = 0;
    const maxLength = Math.max(str1.length, str2.length);
    
    for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
        if (str1[i] === str2[i]) matches++;
    }
    
    if (longer.includes(shorter)) {
        matches += shorter.length * 0.5;
    }
    
    return matches / maxLength;
};

// MangaDX search function (runs in background to avoid CORS)
const searchMangaDXImage = async (manhwaTitle, fallbackImage) => {
    try {
        console.log(`Background: Searching MangaDX for: "${manhwaTitle}"`);
        
        const searchParams = new URLSearchParams();
        searchParams.append('title', manhwaTitle);
        searchParams.append('limit', '10');
        searchParams.append('includes[]', 'cover_art');
        searchParams.append('contentRating[]', 'safe');
        searchParams.append('contentRating[]', 'suggestive');
        searchParams.append('contentRating[]', 'erotica');
        
        const response = await fetch(`https://api.mangadex.org/manga?${searchParams.toString()}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'ManhwaTracker/1.0'
            }
        });
        
        if (!response.ok) {
            console.warn('Background: MangaDX API request failed:', response.status);
            return { success: false, imageUrl: fallbackImage };
        }
        
        const data = await response.json();
        const results = data.data || [];
        
        console.log(`Background: Found ${results.length} results from MangaDX`);
        
        // Find the best matching result
        let bestMatch = null;
        let bestSimilarity = 0;
        
        for (const manga of results) {
            const titles = [
                manga.attributes.title.en,
                manga.attributes.title.ja,
                manga.attributes.title.ko,
                ...(manga.attributes.altTitles || []).flatMap(alt => Object.values(alt))
            ].filter(Boolean);
            
            for (const title of titles) {
                if (titlesSimilar(title, manhwaTitle, 0.7)) {
                    const similarity = calculateSimilarity(normalizeTitle(title), normalizeTitle(manhwaTitle));
                    if (similarity > bestSimilarity) {
                        bestSimilarity = similarity;
                        bestMatch = manga;
                    }
                }
            }
        }
        
        if (bestMatch && bestSimilarity > 0.7) {
            const coverArt = bestMatch.relationships?.find(rel => rel.type === 'cover_art');
            if (coverArt?.attributes?.fileName) {
                const coverUrl = `https://uploads.mangadex.org/covers/${bestMatch.id}/${coverArt.attributes.fileName}`;
                console.log(`Background: Found matching cover for "${manhwaTitle}": ${coverUrl} (similarity: ${bestSimilarity.toFixed(2)})`);
                return { success: true, imageUrl: coverUrl };
            }
        }
        
        console.log(`Background: No good match found for "${manhwaTitle}", using fallback image`);
        return { success: false, imageUrl: fallbackImage };
        
    } catch (error) {
        console.error('Background: Error searching MangaDX:', error);
        return { success: false, imageUrl: fallbackImage };
    }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getTitle') {
    console.log("message processing");
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
              chrome.tabs.sendMessage(tabs[0].id, message, sendResponse);
          }
      });
      return true;
  }
  
  if (message.type === 'getMangaDxSecret') {
    // Securely provide the API key to content scripts
    sendResponse({ apiKey: MANGA_DEX_SECRET });
    return true;
  }
  
  if (message.type === 'searchMangaDXImage') {
    // Handle MangaDX search request from content script
    (async () => {
      try {
        const result = await searchMangaDXImage(message.title, message.fallbackImage);
        sendResponse(result);
      } catch (error) {
        console.error('Background: Error in MangaDX search:', error);
        sendResponse({ success: false, imageUrl: message.fallbackImage });
      }
    })();
    return true; // Keep message channel open for async response
  }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ isFirstOpen: true });
  });
  
