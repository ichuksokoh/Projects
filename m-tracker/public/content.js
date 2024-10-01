/* eslint-disable no-undef */

const manhwaList = [];

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
 
    return domain;

}

//in case on chapter and not series fetch title from chapter
// const getTitle = () => {
//     const domain = getDomain();
//     const html = document.documentElement.innerHTML;
//     const tempDiv = document.createElement('div');
//     tempDiv.innerHTML = html;
//     let title = "";
//     if (domain.includes('asura')) {
//         const titleElem = tempDiv.querySelector('span.cursor-pointer.pl-1')
//         title = titleElem ? titleElem.textContent.trim() : "";
//     }
//     else if (domain.includes('flame')) {
//         const titleContainer = tempDiv.querySelector('div.allc');
//         const titleElem = titleContainer.querySelector('a');
//         title = titleElem ? titleElem.textContent.trim() : "";
//     }
    
//     else if (domain.includes('reaperscans')) {
//         const titleElem = tempDiv.querySelector('h2.font-semibold.font-sans.text-muted-foreground.text-xxs')
//         title = titleElem ? titleElem.textContent.trim() : "";
//     }
//     else if (domain.includes('manganato')) {
//         const titleElem = tempDiv.querySelectorAll('a.a-h')
//         title = titleElem[1] ? titleElem[1].textContent.trim() : "";
//     }
//     else if (domain.includes('mangago')) {
//         const titleElem = tempDiv.querySelector('#series')
//         title = titleElem ? titleElem.textContent.trim() : "";
//     }

//     chrome.storage.local.get([title], (result) => {
//         if (result === null) {
//             title = "";
//         }
//     })

//     return title;
// };

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
                chrome.storage.local.set({ [manhwaTitle]: existingManhwa })
            }
            else {
                Manhwa.chapters = newChapters;
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
        const titleElem = tempDiv.querySelector('span.text-xl.font-bold'); 
        const manhwaTitle = titleElem ? titleElem.textContent.trim() : "";

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

        //get description (Asura makes it difficult smh)
        const spanElems = document.querySelectorAll('span.font-medium.text-sm');
        let descriptions = [];

        //loop through span elems with text (again why Asura)
        spanElems.forEach(span => {
            // Get the text content of the span, trim it, and push it to the array
            descriptions.push(span.textContent.trim());
        });
        
        const combinedDescription = descriptions.join(' ');

        
        //Entire Manhwa stored as one object
        const Manhwa = {title: manhwaTitle, description: combinedDescription, chapters: [], img: imgUrl};

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
    const titleElem = tempDiv.querySelector("h1.entry-title");
    const manhwaTitle = titleElem ? titleElem.textContent.trim() : "";

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


const scrapeMangago = () => {
        //Get html content from page
        const html = document.documentElement.innerHTML;

        //store content in temporary DOM element
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        //get title
        const titleElem = tempDiv.querySelector('div.w-title');
        const manhwaTitle = titleElem ? titleElem.textContent : "";

        //get number of chapters
        const chpNum = tempDiv.querySelectorAll('a.chico');

        chpNum.forEach((chp) => {
            const chpNumElem = chp ? chp.textContent.trim() : null;
            if (chpNumElem) {
                manhwaList.push({ chapter: chpNumElem, read: false });
            }
        })

        //get cover art
        const imgElem = tempDiv.querySelector('img.loading');
        const imgElem2 = tempDiv.querySelector('img.loaded');
        const imgUrl = imgElem ? imgElem.getAttribute('src') : imgElem2 ? imgElem2.getAttribute('src') : "";

        //get description
        const descriptElem = tempDiv.querySelector('div.manga_summary');
        const description = descriptElem ? descriptElem.textContent.trim() : "";
        

        const Manhwa = {title: manhwaTitle, description: description, chapters: [], img: imgUrl };

        update(manhwaTitle, manhwaList.reverse(), Manhwa);

        return manhwaTitle
}


const scrapeManganato = () => {
       //Get html content from page
       const html = document.documentElement.innerHTML;

       //store content in temporary DOM element
       const tempDiv = document.createElement('div');
       tempDiv.innerHTML = html;

       //get title
       const containerTitle = tempDiv.querySelector('div.story-info-right');
       const titleElem = containerTitle.querySelector('h1');
       const manhwaTitle = titleElem ? titleElem.textContent.trim() : "";

       //get num of chpaters
       const ChpElems = tempDiv.querySelectorAll('a.chapter-name');
       ChpElems.forEach((elem) => {
            const chpNumElem = elem ? elem.textContent.trim() : null;
            if (chpNumElem) {
                manhwaList.push({ chapter: chpNumElem, read: false });
            }
       })

       //get cover art
       const imgContainer = tempDiv.querySelector('span.info-image')
       const imgElem = imgContainer.querySelector("img.img-loading");
       const imgUrl = imgElem ? imgElem.getAttribute('src') : "";
       
       //get manhwa description
       const descriptElem = tempDiv.querySelector('div.panel-story-info-description')
       const description = descriptElem ? descriptElem.textContent.trim() : "";

       const Manhwa = { title: manhwaTitle, description: description, chapters: [], img: imgUrl };
       
       update(manhwaTitle, manhwaList.reverse(), Manhwa);
    

    return manhwaTitle;
}

const scrapeReaperScans = () => {
        console.log("Called reaperscans");
              //Get html content from page
       const html = document.documentElement.innerHTML;

       //store content in temporary DOM element
       const tempDiv = document.createElement('div');
       tempDiv.innerHTML = html;

       //get title
       const titleElem = tempDiv.querySelector('h1.text-xl.text-foreground.font-bold.text-center');
       const manhwaTitle = titleElem ? titleElem.textContent.trim() : "";

       //get number of chapters
       const chpElem = tempDiv.querySelectorAll("span.text-muted-foreground.line-clamp-1");
       let chpnum =  0;
       chpnum = Number(chpElem[1].textContent.trim());
       for (let i = 0; i < chpnum; i++ ) {
        manhwaList.push({ chapter: "Chapter " + String(i+1), read: false });
       }

       //get cover art
       const imgElem = tempDiv.querySelector("img.w-full.h-full.object-fit.rounded-lg");
       const imgUrl = imgElem ? "https://reaperscans.com" + imgElem.getAttribute("src") : "";

       //get Manhwa description
       const descriptElem = tempDiv.querySelector("div.text-muted-foreground");
       const description = descriptElem ? descriptElem.innerText ||  descriptElem.textContent : "";



       const Manhwa = { title: manhwaTitle, description: description, chapters: [], img: imgUrl };

       update(manhwaTitle, manhwaList.reverse(), Manhwa);
    return manhwaTitle;
}




    // Run the scraping functions
    const domain = getDomain();
    console.log(domain);    


    let title = "";
    // chrome.runtime.sendMessage({ domain });
    if (domain.includes('asura') && domain.includes('series')) {
        title = scrapeAsuraScans();
    }
    else if (domain.includes('flame') && domain.includes('series')) {
        title = scrapeFlameScans();
    }
    
    else if (domain.includes('mangago') && domain.includes('read-manga')) {
       title = scrapeMangago();
    }
    else if (domain.includes('manganato') && domain.includes('manga-')) {
            title = scrapeManganato();
    }
    else if (domain.includes('reaperscans') && domain.includes('series')) {
        title = scrapeReaperScans();
    }
    

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'getTitle') {
        sendResponse({ title: title });
    }
    return true; // Allows the async response
});
