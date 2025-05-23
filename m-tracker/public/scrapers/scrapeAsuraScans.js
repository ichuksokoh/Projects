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
        const titleElem = tempDiv.querySelector('h3.hover\\:text-themecolor.cursor-pointer.text-white.text-sm.shrink-0.truncate');
        const manhwaTitle = titleElem ? titleElem.textContent.trim() : getTitle();

        //Get chapters for manipulation
        const elems = tempDiv.querySelectorAll('h3.text-sm.text-white.font-medium');
        elems.forEach((header) => {
            const textNode = Array.from(header.childNodes)
            .find(node => node.nodeType === 3); // Selects the text node
            const chpContent = textNode.textContent.split(" ")[1].trim();
            if (chpContent !== "" && chpContent !== null) {
                manhwaList.push({chapter: chpContent, read: false});
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
        const Manhwa = {title: manhwaTitle, description: combinedDescription, chapters: [], 
            img: imgUrl, fav: false, rating: 0.0, status: 0, hidden: false};
        update(manhwaTitle, manhwaList.reverse(), Manhwa);

 
        return manhwaTitle;
};
