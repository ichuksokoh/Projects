/* eslint-disable no-undef */


const scrapeAsuraScans = (update, getTitle, manhwaList) => {
        // Get the entire page's HTML content
        const html = document.documentElement.innerHTML;

        // Create a temporary DOM element to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        // 
        // const tempDiv = document.documentElement


        // Adjust selectors to target the right elements in the DOM
        const titleElem = tempDiv.querySelector('span.text-xl.font-bold'); 
        const manhwaTitle = titleElem ? titleElem.textContent.trim() : getTitle();

        //Get chapters for manipulation
        const elems = tempDiv.querySelectorAll('h3.text-sm.text-white.font-medium');
        elems.forEach((header) => {
            const href = header.querySelector('a.flex.flex-row');
            if (href) {
                let chpname = href.textContent;
                let children = href.childNodes
                let chp = null;
                if (children && children[0] != null && (children[0].textContent.trim() !== "Chapter" && children[0].textContent !== undefined)) {
                    chp = children[0].textContent.replace("Chapter", "").trim();
                }
                else {
                    let splitChp = chpname.split(" ");
                    chp = splitChp[1];
                }
                manhwaList.push({chapter : chp, read : false});
            }
        });


        //get cover art
        const imgElem = document.querySelector('img[alt="poster"]');
        const imgUrl =  imgElem ? imgElem.getAttribute('src') : "";

        //get description (Asura makes it difficult smh)
        const spanElems = document.querySelectorAll('span.font-medium.text-sm');
        let descriptions = [];

        //loop through span elems with text (again why Asura)
        spanElems.forEach(span => {
            // Get the text content of the span, trim it, and push it to the array
            descriptions.push(span.textContent.trim());
        });
        
        const combinedDescription = descriptions.join(' ');

      
        
        //Entire Manhwa stored as one object
        const Manhwa = {title: manhwaTitle, description: combinedDescription, chapters: [], img: imgUrl, fav: false, rating: 0.0, status: 0};
        update(manhwaTitle, manhwaList.reverse(), Manhwa);

 
        return manhwaTitle;
};
