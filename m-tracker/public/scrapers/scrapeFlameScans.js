


const scrapeFlameScans = (update, getTitle, manhwaList) => {
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

        const chapter = chapterNumElement ? chapterNumElement.textContent.trim().replace("Chapter", "").trim() : null;
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