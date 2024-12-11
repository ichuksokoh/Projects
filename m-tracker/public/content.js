/* eslint-disable no-undef */

var manhwaList = [];
var exist = false;

// const supportedSites = [
//    "https://asuracomic.net/*",
//    "https://flamecomics.xyz/*",
//    "https://reaperscans.com/*",
//    "https://manganato.com/*",
//    "https://www.mangago.me/*",
//    "https://mangakakalot.com/*",
//    "https://drakecomic.org/*",
//    "https://hivetoon.com/*",
//    "https://astrascans.org/*",
//    "https://nightsup.net/*",
//    "https://rizzfables.com/*",
//    "https://bato.to/*"
// ].sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase()));

const getDomain = () => {
    const hostname = window.location.href;
    console.log("hostname: ", hostname);
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
    if (hostname.includes('manganato')) {
        domain += " manganato"
    }
    if (hostname.includes('manga-')) {
        domain += " manga-"
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
    if (hostname.includes("bato")) {
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
    else if (domain.includes('manganato')) {
        const titleElem = tempDiv.querySelectorAll('a.a-h')
        title = titleElem[1] ? titleElem[1].textContent.trim() : "";
    }
    else if (domain.includes('mangago')) {
        const titleElem = tempDiv.querySelector('#series')
        title = titleElem ? titleElem.textContent.trim() : "";
    }
    else if (domain.includes('mangakakalot')) {
        const titleElement = document.querySelector('span[itemprop="itemListElement"] a[itemprop="item"]');
        title = titleElement ? titleElement.getAttribute('title') : "";

    }
    else if (domain.includes("astra") || 
        domain.includes("drake") || domain.includes("void")
        || domain.includes("nights") || domain.includes("rizz")) {
        const titleElement = document.querySelector("div.allc a");
        title = titleElement ? titleElement.textContent.trim() : "";
    }

   else if (domain.includes("bato")) {
        const titleElement = document.querySelector('h3.nav-title a');
        title = titleElement ? titleElement.textContent.trim() : "";
   }



   
    return title;
};

  const update =  (manhwaTitle, newChapters, Manhwa) => {
        console.log("manhwaTitle: ", manhwaTitle);
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
                chrome.storage.local.set({ [manhwaTitle]: existingManhwa });
                exist = true;
            }
            else if (newChapters.length !== 0) {
                exist = true; //it will exist
                Manhwa.chapters = newChapters;
                console.log("Psibl New Manhwa: ", Manhwa);
                chrome.storage.local.set({ [manhwaTitle] : Manhwa });
            }
        });
};


    // Run the scraping functions
    let title = "";
    const domainPrime = getDomain();
    const hostnamePrime = window.location.href;

    console.log("hostnamePrime: ", hostnamePrime);


    const updateSite = (domain, hostname) => {
        if (domain.includes('asura') && domain.includes('series')) {
            title = scrapeAsuraScans(update, getTitle, manhwaList);
        }
        else if (domain.includes('flame') && hostname.length > 24) {
            title = scrapeFlameScans(update, getTitle, manhwaList);
        }
        
        else if (domain.includes('mangago') && domain.includes('read-manga')) {
           title = scrapeMangago(update, getTitle, manhwaList);
        }
        else if ((domain.includes('manganato') && domain.includes('manga-'))
            || domain.includes("chapmanganato")) {
                title = scrapeManganato(update, getTitle, manhwaList);
        }
        else if (domain.includes('reaperscans') && domain.includes('series')) {
            title = scrapeReaperScans(update, getTitle, manhwaList);
        }
        else if (domain.includes('mangakakalot') && (domain.includes("/manga") || domain.includes("read-"))) {
            title = scrapeMangakakalot(update, getTitle, manhwaList);
        }
        else if (domain.includes('astra') || domain.includes('drake') || domain.includes('void')
            || domain.includes('nights') || domain.includes('rizz')) {
            title = scrapeAstraDrakeAndMoreScans(update, getTitle, manhwaList);
        }
        else if(domain.includes("bato") &&
             (domain.includes("series") || domain.includes("chapter"))) {
            title = scrapeBatoScans(update, getTitle, manhwaList);
        }
    }



    
    window.addEventListener('load', () => updateSite(domainPrime, hostnamePrime));
    // updateSite(domainPrime, hostnamePrime);

    const observer = new MutationObserver(() => {
        const currentURL = window.location.href;
    
        // Check if the URL matches a series page pattern

        if (currentURL.includes("series") && (currentURL.includes("reaper") || currentURL.includes("flame"))) {
            let domain = getDomain();
            updateSite(domain, currentURL);
            manhwaList = [];
        }

    });
    
    // Start observing changes in the DOM
    observer.observe(document.body, { childList: true, subtree: true });


    


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'getTitle') {
        // console.log("Value of title in content.js: ", title);
        // console.log("Value of exist in content.js: ", exist);
        sendResponse({ title : exist ?  title : "" });
    }
    return true; // Allows the async response
});
