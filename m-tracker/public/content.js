/* eslint-disable no-undef */

var manhwaList = [];
var exist = false;


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
    if (hostname.includes("readtoto")) {
        domain += "readtoto";
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
        const titleElement = document.querySelectorAll('span[itemprop="itemListElement"] a[itemprop="item"]');
        title = titleElement[1] ? titleElement[1].getAttribute('title') : "";

    }
    else if (domain.includes("astra") || 
        domain.includes("drake")
        || domain.includes("nights") || domain.includes("rizz")) {
        const titleElement = document.querySelector("div.allc a");
        title = titleElement ? titleElement.textContent.trim() : "";
    }

    else if (domain.includes("void")) {
        const titleElement = document.querySelector("div.font-semibold.text-gray-50.text-sm.flex.items-center.content-center");
        title = titleElement ? titleElement.textContent.split("Chapter")[0].trim() : "";
    }

   else if (domain.includes("bato")) {
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
        else if (domain.includes('astra') || domain.includes('drake')
            || domain.includes('nights') || domain.includes('rizz')) {
            title = scrapeAstraDrakeAndMoreScans(update, getTitle, manhwaList);
        }
        else if(domain.includes("readtoto") &&
             (domain.includes("series") || domain.includes("chapter"))) {
            title = scrapeBatoScans(update, getTitle, manhwaList);
        }
        else if (domain.includes("void")) {
            title = scrapeVoidScans(update, getTitle, manhwaList);
        }
    }

    
    window.addEventListener('load', () => updateSite(domainPrime, hostnamePrime));
    // updateSite(domainPrime, hostnamePrime);

    const observer = new MutationObserver(() => {
        const currentURL = window.location.href;
    
        // Check if the URL matches a series page pattern

        if (currentURL.includes("series") && (currentURL.includes("hive") || currentURL.includes("reaper") || currentURL.includes("flame"))) {
            let domain = getDomain();
            updateSite(domain, currentURL);
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
