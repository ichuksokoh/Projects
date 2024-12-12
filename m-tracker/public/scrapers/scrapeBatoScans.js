

const scrapeBatoScans = (update, getTitle, manhwaList) => {
    const html = document.documentElement.innerHTML;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    //get manhwa title
    const TitleElem = tempDiv.querySelector('h3.item-title a')
    const manhwaTitle = TitleElem ? TitleElem.textContent.trim() : getTitle();


    //get manhwa Cover art
    const imgElem = tempDiv.querySelector('div.col-24.col-sm-8.col-md-6.attr-cover img');
    const imgUrl = imgElem ? imgElem.getAttribute('src') : "";

    //get manhwa description
    const descriptElem = tempDiv.querySelector('#limit-height-body-summary div.limit-html');
    const description = descriptElem ? descriptElem.textContent.trim() : "";

    //get manhwa chapters
    const chapterElems = tempDiv.querySelectorAll('a.visited.chapt');
    chapterElems.forEach((elem) => {
        const madeChap = elem.textContent.trim();
        manhwaList.push({chapter: madeChap, read: false});
    })

    const Manhwa = {title: manhwaTitle, description: description, chapters: [], img: imgUrl, fav: false, rating: 0.0, status: 0};

    update(manhwaTitle, manhwaList.reverse(), Manhwa);

    return manhwaTitle;
}