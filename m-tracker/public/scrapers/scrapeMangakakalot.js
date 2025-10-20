

const scrapeMangakakalot = async (update, getTitle, manhwaList, getBestImage) => {
    // Get the entire page's HTML content
    const html = document.documentElement.innerHTML;

    //create a temporary DOM element to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;


    //get manhwa Title
    const titleElem = tempDiv.querySelector('ul.manga-info-text h1');
    const manhwaTitle = titleElem ? titleElem.textContent.trim() : getTitle();

    //Get chapters for manipulation
    const chapterList = tempDiv.querySelector('.chapter-list');

    // Get all rows within the chapter list
    const rows = chapterList !== null ? chapterList.querySelectorAll('.row') : [];

    rows.forEach(row => {
        const chapterLink = row.querySelector('a');
        const chpNumElem = chapterLink ? chapterLink.textContent.trim() : null;
        if (chpNumElem) {
            manhwaList.push({ chapter: chpNumElem, read: false });
        }
    });


    //get cover art from page
    const imgElem = tempDiv.querySelector('div.manga-info-pic img');
    const pageImage =  imgElem ? imgElem.getAttribute('src') : "";

    // Get the best available image (MangaDX match or page image)
    const imgUrl = await getBestImage(manhwaTitle, pageImage);

    //get description 
    const getDescription = tempDiv.querySelector('#contentBox');
    const description = getDescription ? getDescription.textContent.trim() : "";


    const Manhwa = {title: manhwaTitle, description: description, chapters: [], 
        img: imgUrl, fav: false, rating: 0.0, status: 0, hidden: false};
    update(manhwaTitle, manhwaList.reverse(), Manhwa);
    return manhwaTitle;
}