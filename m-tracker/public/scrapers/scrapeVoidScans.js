/* eslint-disable no-undef */


const scrapeVoidScans = (update, getTitle, manhwaList) => {
    const html = document.documentElement.innerHTML;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

     //get manhwa Title
     const TitleElem = tempDiv.querySelector('span.block.text-sm.text-gray-700.dark\\:text-gray-400');
     const manhwaTitle = TitleElem ? TitleElem.textContent.trim() : getTitle();



     //getting manhwa chapters
    const button = document.querySelector('[data-key="chapters"]');
    const chpNum = button ? Number(button.textContent.split("(")[1].split(")")[0]) : 0;
    for (let i = 1; i <= chpNum; i++) {
        manhwaList.push({chapter: i, read: false});
    }

    //get manhwa cover art
    const imgElem = tempDiv.querySelector('img.w-full.rounded-lg.object-cover.object-bottom.sm\\:max-h-\\[400px\\].h-auto')
    const imgUrl = imgElem ? imgElem.getAttribute('src') : "";

    //get manhwa description
    const descriptElem  = tempDiv.querySelector('div[itemprop="description"].p-4.bg-white\\/10.rounded-lg');
    const description = descriptElem ? descriptElem.textContent.trim() : "";


    const Manhwa = {title: manhwaTitle, description: description, chapters: [], 
        img: imgUrl, fav: false, rating: 0.0, status: 0, hidden: false};


    update(manhwaTitle, manhwaList, Manhwa);

     return manhwaTitle;
    
}