






const scrapeAstraDrakeAndMoreScans = (update, getTitle, manhwaList) => {
    const html = document.documentElement.innerHTML;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;


    //get manhwa Title
    const TitleElem = tempDiv.querySelector('#titlemove h1.entry-title');
    const manhwaTitle = TitleElem ? TitleElem.textContent.trim() : getTitle();

    //getting manhwa Cover art
    const imgElem = tempDiv.querySelector('img.attachment-.size-.wp-post-image')
    const imgUrl = imgElem ? imgElem.getAttribute('src') : "";
    console.log("imgUrl:", imgUrl);

    //getting description
    const descriptElem = tempDiv.querySelector('div.entry-content.entry-content-single');
    const description = descriptElem ? descriptElem.textContent.trim() : "";

    const chapterDiv = tempDiv.querySelector('#chapterlist');
    const chapterElems = chapterDiv ? chapterDiv.querySelectorAll('div.chbox') : null;
    if (chapterElems) {
        chapterElems.forEach((elems) => {
            const chap = elems.querySelector('div.eph-num a span.chapternum');
            const madeChap = chap ? chap.textContent.replace("Chapter", "").trim() : null;
            if (madeChap !== null) {
                manhwaList.push({chapter : madeChap, read: false});
            }
        })
    }

    const Manhwa = {title: manhwaTitle, description: description, chapters: [], 
        img: imgUrl, fav: false, rating: 0.0, status: 0, hidden: false};
    update(manhwaTitle, manhwaList.reverse(), Manhwa);

    return manhwaTitle;
}