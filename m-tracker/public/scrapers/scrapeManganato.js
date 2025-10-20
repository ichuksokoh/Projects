


const scrapeManganato = async (update, getTitle, manhwaList, getBestImage) => {
    //Get html content from page
    const html = document.documentElement.innerHTML;

    //store content in temporary DOM element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    //get title
    // const containerTitle =
    const titleElem =  tempDiv.querySelector('ul.manga-info-text > li > h1');
    const manhwaTitle = titleElem ? titleElem.textContent.trim() : getTitle();

    //get num of chpaters
    const ChpElems = tempDiv.querySelectorAll('div.chapter-list > div.row');
    ChpElems.forEach((elem) => {
        chp = elem.querySelectorAll("span > a");
         const chpNumElem = chp[0] ? chp[0].textContent.trim() : null;
         if (chpNumElem) {
             manhwaList.push({ chapter: chpNumElem, read: false });
         }
    })

    //get cover art from page
    const imgContainer = tempDiv.querySelector('div.manga-info-pic');
    const imgElem = imgContainer ? imgContainer.querySelector("img.lz-loading") : null ;
    const pageImage = imgElem ? imgElem.getAttribute('src') : "";
    
    // Get the best available image (MangaDX match or page image)
    const imgUrl = await getBestImage(manhwaTitle, pageImage);
    
    //get manhwa description
    const descriptElem = tempDiv.querySelector('#contentBox');
    const description = descriptElem ? descriptElem.textContent.trim() : "";

    const Manhwa = {title: manhwaTitle, description: description, chapters: [], 
        img: imgUrl, fav: false, rating: 0.0, status: 0, hidden: false};    
    update(manhwaTitle, manhwaList.reverse(), Manhwa);
    

 return manhwaTitle;
}