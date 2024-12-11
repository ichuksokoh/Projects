


const scrapeManganato = (update, getTitle, manhwaList) => {
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

    const Manhwa = { title: manhwaTitle, description: description, chapters: [], img: imgUrl, fav: false, rating: 0.0, status: 0};
    
    update(manhwaTitle, manhwaList.reverse(), Manhwa);
 

 return manhwaTitle;
}