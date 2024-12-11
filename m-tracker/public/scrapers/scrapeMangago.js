


const scrapeMangago = (update, getTitle, manhwaList) => {
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
    

    const Manhwa = {title: manhwaTitle, description: description, chapters: [], img: imgUrl, fav: false, rating: 0.0, status: 0};

    update(manhwaTitle, manhwaList.reverse(), Manhwa);

    return manhwaTitle
}