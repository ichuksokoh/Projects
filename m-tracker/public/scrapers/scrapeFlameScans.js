


const scrapeFlameScans = (update, getTitle, manhwaList) => {
    //Get html content from page
    const html = document.documentElement.innerHTML;

    //store content in temporary DOM element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    //target correct DOM elements
    const elems = tempDiv.querySelectorAll(".ChapterCard_chapterWrapper__j8pBx");

    //get manhwa title
    const titleElem = tempDiv.querySelector("h1.m_8a5d1357.mantine-Title-root");
    // const manhwaTitle = titleElem ? titleElem.textContent.trim() : getTitle();

    const manhwaTitle = titleElem ? titleElem.textContent.trim() : getTitle();

    //get chapters
    elems.forEach((elem) => {
        const chapterNumElement = elem.querySelector('p.m_b6d8b162');

        const chapter = chapterNumElement ? chapterNumElement.textContent.trim().replace("Chapter", "").trim() : null;
        if (chapter) {
            manhwaList.push({ chapter: parseInt(chapter, 10), read: false });
        }
    });

    //get cover art
    const imgElem = tempDiv.querySelector('img[alt="Cover"]');
    const imgUrl = imgElem ? imgElem.getAttribute('src') : "";

    //Get manhwa description
    const descriptElem = tempDiv.querySelector('p.m_b6d8b162[data-line-clamp="true"]');
    let combinedDescription = descriptElem ? descriptElem.textContent.trim() : "";
    if (combinedDescription !== "") {
        let tmp = combinedDescription.split("&nbsp");
        combinedDescription = tmp[0];
    }
    else {
        const descriptElem2 = tempDiv.querySelector('p.m_b6d8b162[data-line-clamp="true"] + p');
        let tmp2 = descriptElem2 ? descriptElem2.textContent.trim(): "";
        combinedDescription = tmp2;
    }
    
    
    //Entire manhwa stored as one object
    const Manhwa = {title: manhwaTitle, description: combinedDescription, chapters: [], 
        img: imgUrl, fav: false, rating: 0.0, status: 0, hidden: false};
    update(manhwaTitle, manhwaList.reverse(), Manhwa);


    return manhwaTitle;
};