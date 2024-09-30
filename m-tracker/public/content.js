/* eslint-disable no-undef */

const manhwaList = [];

const getDomain = () => {
    const { hostname } = window.location;
    if (hostname.includes('asura')) {
        return 'asura';
    }
    if (hostname.includes('flame')) {
        return 'flame';
    }

    return '';

}

const update =  (manhwaTitle, newChapters, Manhwa) => {
        chrome.storage.local.get([manhwaTitle], (result) => {
            if (result[manhwaTitle]) {
                const existingManhwa = result[manhwaTitle];
                const existingChapters = existingManhwa?.chapters || [];
                const read = existingManhwa.lastRead > 0 ?  existingManhwa.lastRead : 0;
    
                const updatedChapters = [...existingChapters];
    
                newChapters.forEach(newChapter => {
                    if (!existingChapters.some(existingChapter => existingChapter.chapter === newChapter.chapter)) {
                        updatedChapters.push(newChapter);
                    }
                });
                existingManhwa.chapters = updatedChapters;
                existingChapters.lastRead = read;
                chrome.storage.local.set({ [manhwaTitle]: existingManhwa })
            }
            else {
                Manhwa.chapters = newChapters;
                Manhwa.lastRead = read;
                chrome.storage.local.set({ [manhwaTitle] : Manhwa });
            }
        });
};


const scrapeAsuraScans = () => {
    try {
        // Get the entire page's HTML content
        const html = document.documentElement.innerHTML;

        // Create a temporary DOM element to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;



        // Adjust selectors to target the right elements in the DOM
        const elements = tempDiv.querySelectorAll('div'); 
        const manhwaTitle = tempDiv.querySelector('span.text-xl.font-bold').textContent;

        //Get chapters for manipulation
        elements.forEach(element => {
            const chapter = element.textContent;


            const regex2 = /Chapter\s+\d+/;
            if (regex2.test(chapter) && chapter.length <= 200) {
                manhwaList.push({ chapter });
            }
        });

        const chapterRegex = /Chapter\s+(\d+)/;
        const dateRegex = /(\w+\s+\d{1,2}(?:th|st|nd|rd)?\s+\d{4})$/;
    
        const results = manhwaList.map(item => {
            const chpMatch = item.chapter.match(chapterRegex);
            const dateMatch = item.chapter.match(dateRegex);
            const res = {};
            if (chpMatch) {
                res.chapter = chpMatch[1];
            }
            if (dateMatch) {
                res.date = dateMatch[1];
            }
            res.read = false;
            return res;
        }).filter(item => item.chapter !== undefined && item.date !== undefined)
        .map((item, _) => {
            return {chapter: item.chapter, read: item.read}
        });

        const results2 = results.filter((item, index, self) => 
            index === self.findIndex((t) => (
                t.chapter === item.chapter && t.read === item.read
            ))
        ).reverse();
        





        //get cover art
        const imgElem = document.querySelector('img[alt="poster"]');
        const imgUrl =  imgElem ? imgElem.getAttribute('src') : "";
        console.log("Cover Art soruce: ", imgUrl);

        //get description (Asura makes it difficult smh)
        const spanElems = document.querySelectorAll('span.font-medium.text-sm');
        let descriptions = [];

        //loop through span elems with text (again why Asura)
        spanElems.forEach(span => {
            // Get the text content of the span, trim it, and push it to the array
            descriptions.push(span.textContent.trim());
        });
        
        const combinedDescription = descriptions.join(' ');
        console.log(combinedDescription);

        
        //Entire Manhwa stored as one object
        const Manhwa = {title: manhwaTitle, description: combinedDescription, chapters: [], img: imgUrl, lastRead : 0};

        update(manhwaTitle, results2, Manhwa);

        // Save to Chrome Storage
        // if (manhwaList.length !== 0) {
        //     chrome.storage.local.set({ [manhwaTitle]: Manhwa });
        // }
        return manhwaTitle;
    } catch (error) {
        console.error('Error scraping the site:', error.message);
    }
};


const scrapeFlameScans = () => {
    //Get html content from page
    const html = document.documentElement.innerHTML;

    //store content in temporary DOM element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    //target correct DOM elements
    const elems = tempDiv.querySelectorAll("#chapterlist li");

    //get manhwa title
    const manhwaTitle = tempDiv.querySelector("h1.entry-title").textContent;
    console.log(manhwaTitle);

    //get chapters
    elems.forEach((elem) => {
        const chapterNumElement = elem.querySelector('span.chapternum');

        const chapter = chapterNumElement ? chapterNumElement.textContent.trim().replace("Chapter\n", "").trim() : null;
        if (chapter) {
            manhwaList.push({ chapter: chapter, read: false });
        }
    });

    //get cover art
    const imgElem = tempDiv.querySelector('img[src*="flamecomics.me/wp-content/uploads/"]');
    const imgUrl = imgElem ? imgElem.getAttribute('src') : "";

    //Get manhwa description
    const descriptElem = tempDiv.querySelector('div.entry-content.entry-content-single');
    const descripts = descriptElem.querySelectorAll('p')

    let dis = []
    descripts.forEach(p => {
        dis.push(p.textContent.trim());
    })
    const combinedDescription = dis.join(' ');



    //Entire manhwa stored as one object
    const Manhwa = {title: manhwaTitle, description: combinedDescription, chapters: [], img: imgUrl};

    update(manhwaTitle, manhwaList.reverse(), Manhwa);

    // Save to Chrome Storage
    // if (manhwaList.length !== 0) {
    //     chrome.storage.local.set({ [manhwaTitle]: Manhwa });
    // }
    return manhwaTitle
};


// document.addEventListener("DOMContentLoaded", () => {
    // Run the scraping functions
    const domain = getDomain();
    let title = "";
    // chrome.runtime.sendMessage({ domain });
    if (domain.includes('asura')) {
        title = scrapeAsuraScans();
    }
    else if (domain.includes('flame')) {
        title = scrapeFlameScans();
    }
    console.log(title);
    // chrome.runtime.sendMessage({title: title});
    const data = {Title: title};
    console.log(data);

    // chrome.runtime.sendMessage(data);
    
    // function sendMsg( message ) {
    //     chrome.runtime.sendMessage({Title: message});
    // }
    
    // sendMsg(title);
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'getTitle') {
        // const title = scrapeAsuraScans() || scrapeFlameScans(); // Get the latest title
        sendResponse({ title: title });
    }
    return true; // Allows the async response
});
