


const scrapeReaperScans = (update, getTitle, manhwaList) => {
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