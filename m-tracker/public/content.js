/* eslint-disable no-undef */

const manhwaList = [];
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
    if (hostname.includes("manga")) {
        domain += " manga";
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
        const titleContainer = tempDiv.querySelector('div.allc');
        const titleElem = titleContainer ? titleContainer.querySelector('a') : null ;
        title = titleElem ? titleElem.textContent.trim() : "";
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
    const domain = getDomain();
    const hostname = window.location.href;


    let title = "";
    // chrome.runtime.sendMessage({ domain });
    if (domain.includes('asura') && domain.includes('series')) {
        title = scrapeAsuraScans(update, getTitle, manhwaList);
    }
    else if (domain.includes('flame') && hostname.length > 23) {
        title = scrapeFlameScans(update, getTitle, manhwaList);
    }
    
    else if (domain.includes('mangago') && domain.includes('read-manga')) {
       title = scrapeMangago(update, getTitle, manhwaList);
    }
    else if (domain.includes('manganato') && domain.includes('manga-')) {
            title = scrapeManganato(update, getTitle, manhwaList);
    }
    else if (domain.includes('reaperscans') && domain.includes('series')) {
        title = scrapeReaperScans(update, getTitle, manhwaList);
    }
    else if (domain.includes('mangakakalot') && domain.includes("manga")) {
        title = scrapeMangakakalot(update, getTitle, manhwaList);
    }
    

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'getTitle') {
        sendResponse({ title : exist ?  title : "" });
    }
    return true; // Allows the async response
});
