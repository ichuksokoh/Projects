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
    }

    
    updateSite(domainPrime, hostnamePrime);

    const observer = new MutationObserver(() => {
        const currentURL = window.location.href;
    
        // Check if the URL matches a series page pattern

        if (currentURL.includes("series")) {
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
