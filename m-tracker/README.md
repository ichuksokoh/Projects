# Project 2 (Google Chrome Extension proejct): Manhwa Tracker
## Version 1 (prototype)

Basic Manhwa tracker that currently supports 2 sites, [Asuracomics][def] and [Flamecomics][def2]
Gives Image and description of any manhwa that has been read on either site. It requires
user to go to the series page for any particular manhwa in order to store the data on that manhwa
The data stored includes chapter count, cover art, description, and title of manhwa. 
Support for more sites to be added, however inate support for any arbitrary manhwa will not be
available for some time.


## Version 2
Additonal Support added for [Reaperscans][def5], [Manganato][def4], and [Mangago][def3] with
additional features for singular and mass deletion of manhwa/manga entries. Also updated
UI for better handling, and capability to see current Manwha/Manga while on chapter
page.

## Version 2.1
Added an option to favorite a manga/manhwa, filter out manhwas not in favorites and add or remove from both manhwa page
and current manhwa page. Also added a chapter count for chapters read on Manhwas page for ease of use to quickly see how mnay chapters have been read. Fixed minor bugs with manhwa not showing up on some chapter pages

## Version 2.2
Additional Support added for [Mangakakalot][def6]. New feature for rating manhwas (half step increments or input number of your choice, must be a number). Refactored scraper logic into their own files to reduce file size of content.js.
Fixed asurascans bug for chapters not being updated properly due to links not loading. Added select all button when deleting items as well as total number of selected items on main page and popup confirmation for delete. Added an info page for supported sites (with clickable links to sites)

## Version 2.4
Additional support for 6 additional sites: [DrakeScans][def7], [VoidScans][def8], [AstraScans][def9], [NightScans][def10], [RizzComics][def11], and [Bato.to][def12]. Also added a hidden manhwa feature to hide desired manhwas from easy view, as well
as updated UI for extension. Added in features to mark manhwas as different statuses; Plan to read, Reading, Completed, and Dropped.

[def]: https://asuracomic.net/
[def2]: https://flamecomics.xyz/
[def3]: https://www.mangago.me/
[def4]: https://manganato.com/
[def5]: https://reaperscans.com/
[def6]: https://mangakakalot.com/
[def7]: https://drakecomic.org
[def8]: https://hivetoon.com
[def9]: https://astrascans.org/
[def10]: https://nightsup.net/
[def11]: https://rizzfables.com/
[def12]: https://bato.to