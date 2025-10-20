/* eslint-disable no-undef */

var manhwaList = [];
var exist = false;

// MangaDX auxiliary functions for image matching
// API key will be retrieved securely from background script
let MANGA_DEX_SECRET = null;

// Function to get API key from background script
const getMangaDxSecret = async () => {
    if (MANGA_DEX_SECRET) {
        return MANGA_DEX_SECRET;
    }
    
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'getMangaDxSecret' }, (response) => {
            if (response && response.apiKey) {
                MANGA_DEX_SECRET = response.apiKey;
                resolve(MANGA_DEX_SECRET);
            } else {
                console.warn('Failed to get MangaDX API key from background script');
                resolve(null);
            }
        });
    });
};

/**
 * Normalize title for better matching
 * Removes special characters, extra spaces, and converts to lowercase
 */
const normalizeTitle = (title) => {
    if (!title) return '';
    
    return title
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove special characters
        .replace(/\s+/g, ' ')    // Replace multiple spaces with single space
        .trim();                 // Remove leading/trailing spaces
};

/**
 * Calculate similarity between two titles using simple string matching
 * Returns true if titles are considered similar enough to be the same work
 */
const titlesSimilar = (title1, title2, threshold = 0.75) => {
    const norm1 = normalizeTitle(title1);
    const norm2 = normalizeTitle(title2);
    
    if (norm1 === norm2) return true;
    if (norm1.length === 0 || norm2.length === 0) return false;
    
    // Check if one title is contained in another (for cases like "Title" vs "Title: Subtitle")
    if (norm1.includes(norm2) || norm2.includes(norm1)) {
        const longer = norm1.length > norm2.length ? norm1 : norm2;
        const shorter = norm1.length > norm2.length ? norm2 : norm1;
        return shorter.length / longer.length >= threshold;
    }
    
    // Count common words
    const words1 = norm1.split(' ').filter(w => w.length > 2);
    const words2 = norm2.split(' ').filter(w => w.length > 2);
    
    if (words1.length === 0 || words2.length === 0) return false;
    
    const commonWords = words1.filter(word => words2.includes(word));
    const similarity = commonWords.length / Math.max(words1.length, words2.length);
    
    return similarity >= threshold;
};

/**
 * Search MangaDX for a manga by title and return the best matching cover image
 */
const searchMangaDXImage = async (manhwaTitle, fallbackImage = '') => {
    try {
        console.log(`Searching MangaDX for: "${manhwaTitle}"`);
        
        // Send request to background script to handle MangaDX API call (avoids CORS)
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({
                type: 'searchMangaDXImage',
                title: manhwaTitle,
                fallbackImage: fallbackImage
            }, (response) => {
                if (response && response.success) {
                    console.log(`Found matching cover for "${manhwaTitle}": ${response.imageUrl}`);
                    resolve(response.imageUrl);
                } else {
                    console.log(`No good match found for "${manhwaTitle}", using fallback image`);
                    resolve(fallbackImage);
                }
            });
        });
        
    } catch (error) {
        console.error('Error searching MangaDX:', error);
        return fallbackImage;
    }
};

/**
 * Calculate precise similarity score between two normalized strings
 */
const calculateSimilarity = (str1, str2) => {
    if (str1 === str2) return 1.0;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    // Use simple character-based similarity
    let matches = 0;
    const maxLength = Math.max(str1.length, str2.length);
    
    for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
        if (str1[i] === str2[i]) matches++;
    }
    
    // Add bonus for contained strings
    if (longer.includes(shorter)) {
        matches += shorter.length * 0.5;
    }
    
    return matches / maxLength;
};

/**
 * Get the best available image - either from MangaDX match or fallback to page image
 */
const getBestImage = async (manhwaTitle, pageImage) => {
    if (!manhwaTitle || manhwaTitle.trim() === '') {
        return pageImage;
    }
    
    try {
        const mangaDXImage = await searchMangaDXImage(manhwaTitle, pageImage);
        return mangaDXImage || pageImage;
    } catch (error) {
        console.error('Error getting best image:', error);
        return pageImage;
    }
};


const getDomain = () => {
    const hostname = window.location.href;
    let domain = "";
    if (hostname.includes('asura')) {
        domain += "asura";
    }
    if (hostname.includes('flame')) {
        domain += "flame";
    }
    if (hostname.includes('reaperscans')) {
        domain += "reaperscans";
    }
    if (hostname.includes('series')) {
        domain += " series"
    }
    if (hostname.includes('mangago')) {
        domain += "mangago";
    }
    if (hostname.includes('read-manga')) {
        domain += " read-manga";
    }
    if (hostname.includes('natomanga')) {
        domain += " natomanga"
    }
    if (hostname.includes('manga')) {
        domain += " manga"
    }
    if (hostname.includes("mangakakalot")) {
        domain += "mangakakalot"
    }
    if (hostname.includes("/manga")) {
        domain += " /manga";
    }
    if (hostname.includes("read-")) {
        domain += " read-"
    }
    if (hostname.includes("chapmanganato")) {
        domain += "chapmanganato"
    }
    if (hostname.includes("drake")) {
        domain += "drake"
    }
    if (hostname.includes("hive")) {
        domain += "void";
    }
    if (hostname.includes("astra")) {
        domain += "astra";
    }
    if (hostname.includes("nights")) {
        domain += "nights";
    }
    if (hostname.includes("rizz")) {
        domain += "rizz";
    }
    if (hostname.includes("readtoto") || hostname.includes("bato")) {
        domain += "bato";
        if (hostname.includes("series")) {
            domain += "series";
        }
        if (hostname.includes("chapter")) {
            domain += "chapter";
        }
    }
 
    return domain;

}

//in case on chapter and not series fetch title from chapter
  const getTitle = () => {
    const domain = getDomain();
    const html = document.documentElement.innerHTML;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    let title = "";
    if (domain.includes('asura')) {
        const titleElem = tempDiv.querySelector('span.cursor-pointer.pl-1')
        title = titleElem ? titleElem.textContent.trim() : "";
    }
    else if (domain.includes('flame')) {
        const titleContainer2 = tempDiv.querySelector('p.mantine-Text-root[data-line-clamp="true"]');
        const titleElem = titleContainer2 ? titleContainer2.textContent.trim() : "";
        title = titleElem;
    }
    
    else if (domain.includes('reaperscans')) {
        const titleElem = tempDiv.querySelector('h2.font-semibold.font-sans.text-muted-foreground.text-xxs')
        title = titleElem ? titleElem.textContent.trim() : "";
    }
    else if (domain.includes('natomanga')) {
        // const titleElem = tempDiv.querySelector('div.info-top-chapter > h2');
        const titleElem = tempDiv.querySelectorAll("div.breadcrumb.breadcrumbs.bred_doc > p > span");
        console.log("TitleElement: ", titleElem);
        title = titleElem[2] ? titleElem[2].textContent.trim() : "";
    }
    else if (domain.includes('mangago')) {
        const titleElem = tempDiv.querySelector('#series')
        title = titleElem ? titleElem.textContent.trim() : "";
    }
    else if (domain.includes('mangakakalot')) {
        const titleElement = tempDiv.querySelectorAll('span[itemprop="itemListElement"] a[itemprop="item"]');
        title = titleElement[1] ? titleElement[1].getAttribute('title') : "";

    }
    else if (domain.includes("astra") || 
        domain.includes("drake")
        || domain.includes("nights") || domain.includes("rizz")) {
        let titleElement = document.querySelector("div.allc a");
        title = titleElement ? titleElement.textContent.trim() : "";
        if (domain.includes("rizz")) {
            titleElement = document.querySelector("h1.entry-title");
            title = titleElement ? titleElement.textContent.split("Chapter")[0].trim() : "";
        }
    }

    else if (domain.includes("void")) {
        const titleElement = document.querySelector("div.font-semibold.text-gray-50.text-sm.flex.items-center.content-center");
        title = titleElement ? titleElement.textContent.split("Chapter")[0].trim() : "";
    }

   else if (domain.includes("bato") || domain.includes("readtoto")) {
        const titleElement = document.querySelector('h3.nav-title a');
        title = titleElement ? titleElement.textContent.trim() : "";
   }



   
    return title;
};

const update =  (manhwaTitle, newChapters, Manhwa) => {
        chrome.storage.local.get([manhwaTitle], (result) => {
            if (result[manhwaTitle]) {
                const existingManhwa = result[manhwaTitle];
                const existingChapters = existingManhwa?.chapters || [];
    
                const updatedChapters = [...existingChapters];
              
                newChapters.forEach(newChapter => {
                    if (!existingChapters.some(existingChapter => existingChapter.chapter === newChapter.chapter)) {
                        updatedChapters.push(newChapter);
                    }
                });
                existingManhwa.chapters = updatedChapters;
                if (existingManhwa.hidden === undefined) {
                    existingManhwa.hidden = false;
                }
                chrome.storage.local.set({ [manhwaTitle]: existingManhwa });
                exist = true;
            }
            else if (newChapters.length !== 0) {
                exist = true; //it will exist
                Manhwa.chapters = newChapters;
                chrome.storage.local.set({ [manhwaTitle] : Manhwa });
            }
        });
};


    // Run the scraping functions
    let title = "";
    const domainPrime = getDomain();
    const hostnamePrime = window.location.href;



    const updateSite = async (domain, hostname) => {
        if (domain.includes('asura') && domain.includes('series')) {
            title = scrapeAsuraScans(update, getTitle, manhwaList);
        }
        else if (domain.includes('flame') && hostname.length > 24) {
            title = scrapeFlameScans(update, getTitle, manhwaList);
        }
        
        else if (domain.includes('mangago') && domain.includes('read-manga')) {
           title = scrapeMangago(update, getTitle, manhwaList);
        }
        else if ((domain.includes('natomanga') && domain.includes('manga'))
            || domain.includes("chapmanganato")) {
                title = await scrapeManganato(update, getTitle, manhwaList, getBestImage);
        }
        else if (domain.includes('reaperscans') && domain.includes('series')) {
            title = scrapeReaperScans(update, getTitle, manhwaList);
        }
        else if (domain.includes('mangakakalot') && (domain.includes("/manga") || domain.includes("read-"))) {
            title = await scrapeMangakakalot(update, getTitle, manhwaList, getBestImage);
        }
        else if (domain.includes('astra') || domain.includes('drake')
            || domain.includes('nights') || domain.includes('rizz')) {
            title = scrapeAstraDrakeAndMoreScans(update, getTitle, manhwaList);
        }
        else if((domain.includes("readtoto") || domain.includes("bato")) &&
             (domain.includes("series") || domain.includes("chapter"))) {
            title = scrapeBatoScans(update, getTitle, manhwaList);
        }
        else if (domain.includes("void")) {
            title = scrapeVoidScans(update, getTitle, manhwaList);
        }
    }

    
    window.addEventListener('load', async () => await updateSite(domainPrime, hostnamePrime));

    const observer = new MutationObserver(async () => {
        const currentURL = window.location.href;
    
        // Check if the URL matches a series page pattern

        if (currentURL.includes("series") && (currentURL.includes("hive") || currentURL.includes("reaper") 
            || currentURL.includes("flame"))) {
            let domain = getDomain();
            await updateSite(domain, currentURL);
            manhwaList = [];
        }

    });
    
    // Start observing changes in the DOM
    observer.observe(document.body, { childList: true, subtree: true });

    
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'getTitle') {
        sendResponse({ title : exist ?  title : "" });
    }
    return true; // Allows the async response
});
