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

const scrapeAsuraScans = () => {
        // Get the entire page's HTML content
        const html = document.documentElement.innerHTML;

        // Create a temporary DOM element to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;



        // Adjust selectors to target the right elements in the DOM
        const titleElem = tempDiv.querySelector('span.text-xl.font-bold'); 
        const manhwaTitle = titleElem ? titleElem.textContent.trim() : getTitle();

        //Get chapters for manipulation
        const elems = tempDiv.querySelectorAll('h3.text-sm.text-white.font-medium');
        elems.forEach((header) => {
            const href = header.querySelector('a.block');
            if (href) {
                let chpname = href.textContent.replace('Chapter', '').trim();
                // console.log("chpname before: ", chpname);Z
                chpname = chpname.match(/^\d+/)[0];
                // console.log("CHPNAME after: " ,chpname);  
                manhwaList.push({chapter : chpname, read : false});
            }
        });


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
        const Manhwa = {title: manhwaTitle, description: combinedDescription, chapters: [], img: imgUrl, fav: false, rating : 1};

        update(manhwaTitle, manhwaList.reverse(), Manhwa);

 
        return manhwaTitle;
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
    // const manhwaTitle = titleElem ? titleElem.textContent.trim() : getTitle();
    const manhwaTitle = getTitle() === "" ? (titleElem ?  titleElem.textContent.trim() : "") : getTitle();

    //get chapters
    elems.forEach((elem) => {
        const chapterNumElement = elem.querySelector('span.chapternum');

        const chapter = chapterNumElement ? chapterNumElement.textContent.trim().replace("Chapter\n", "").trim() : null;
        if (chapter) {
            manhwaList.push({ chapter: chapter, read: false });
        }
    });

    //get cover art
    const imgElem = tempDiv.querySelector('img[src*="flamecomics.xyz/wp-content/uploads/"]');
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
    const Manhwa = {title: manhwaTitle, description: combinedDescription, chapters: [], img: imgUrl, fav: false, rating: 0};

    update(manhwaTitle, manhwaList.reverse(), Manhwa);


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
        const manhwaTitle = titleElem ? titleElem.textContent.trim() : getTitle();

        //get number of chapters
        const chpNum = tempDiv.querySelectorAll('a.chico');

        chpNum?.forEach((chp) => {
            const chpNumElem = chp ? chp.textContent.trim() : null;
            if (chpNumElem) {
                manhwaList.push({ chapter: chpNumElem, read: false });
            }
        })

        //get cover art
        const primeImgElem = tempDiv.querySelector('div.left.cover');
        const imgElem = tempDiv.querySelector('img.loading');
        const imgElem2 = tempDiv.querySelector('img.loaded');
        const primeImg = primeImgElem ? primeImgElem.querySelector('img.loading') : null;
        const primeImg2 = primeImgElem ? primeImgElem.querySelector('img.loaded') : null;
        const flat = primeImg ? primeImg : primeImg2 ? primeImg2 : null;
        const imgUrl = flat ? flat.getAttribute('src') : imgElem ? imgElem.getAttribute('src') : imgElem2 ? imgElem2.getAttribute('src') : "";

        //get description
        const descriptElem = tempDiv.querySelector('div.manga_summary');
        const description = descriptElem ? descriptElem.textContent.trim() : "";
        

        const Manhwa = {title: manhwaTitle, description: description, chapters: [], img: imgUrl, fav: false, rating: 0 };

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
       const titleElem = containerTitle ? containerTitle.querySelector('h1') : null;
       const manhwaTitle = titleElem ? titleElem.textContent.trim() : getTitle();

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
       const imgElem = imgContainer ? imgContainer.querySelector("img.img-loading") : null ;
       const imgUrl = imgElem ? imgElem.getAttribute('src') : "";
       
       //get manhwa description
       const descriptElem = tempDiv.querySelector('div.panel-story-info-description')
       const description = descriptElem ? descriptElem.textContent.trim() : "";

       const Manhwa = { title: manhwaTitle, description: description, chapters: [], img: imgUrl, fav: false, rating: 0 };
       
       update(manhwaTitle, manhwaList.reverse(), Manhwa);
    

    return manhwaTitle;
}

const scrapeReaperScans = () => {
              //Get html content from page
       const html = document.documentElement.innerHTML;

       //store content in temporary DOM element
       const tempDiv = document.createElement('div');
       tempDiv.innerHTML = html;

       //get title
       const titleElem = tempDiv.querySelector('h1.text-xl.text-foreground.font-bold.text-center');
       const manhwaTitle = titleElem ? titleElem.textContent.trim() : getTitle();

       //get number of chapters
       const chpElem = tempDiv.querySelectorAll("span.text-muted-foreground.line-clamp-1");
       let chpnum = chpElem ? Number(chpElem[1]?.textContent.trim()): 0;
       for (let i = 0; i < chpnum; i++ ) {
        manhwaList.push({ chapter: String(i), read: false });
       }

       //get cover art
       const imgElem = tempDiv.querySelector("img.w-full.h-full.object-fit.rounded-lg");
       const imgUrl = imgElem ? "https://reaperscans.com" + imgElem.getAttribute("src") : "";

       //get Manhwa description
       const descriptElem = tempDiv.querySelector("div.text-muted-foreground");
       const description = descriptElem ? descriptElem.innerText ||  descriptElem.textContent : "";



       const Manhwa = { title: manhwaTitle, description: description, chapters: [], img: imgUrl, fav: false, rating: 0 };

       update(manhwaTitle, manhwaList, Manhwa);
    return manhwaTitle;
}






    // Run the scraping functions
    const domain = getDomain();
    const hostname = window.location.href;


    let title = "";
    // chrome.runtime.sendMessage({ domain });
    if (domain.includes('asura') && domain.includes('series')) {
        title = scrapeAsuraScans();
    }
    else if (domain.includes('flame') && hostname.length > 23) {
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
        sendResponse({ title : exist ?  title : "" });
    }
    return true; // Allows the async response
});
