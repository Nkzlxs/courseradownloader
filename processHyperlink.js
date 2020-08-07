processHyperLink()
function processHyperLink() {
    let findMainContainer = setInterval(function () {
        the_container = document.querySelectorAll('div[data-id="item-scroll-container"]')
        the_video_class = "rc-VideoItemWithHighlighting"
        the_supreading_class = "rc-ItemBox rc-ReadingItem"
        the_target_div = the_container[0].children[0].children[0]

        if (the_container.length != 0) {
            console.log("Container Found")
            if (the_target_div.className == the_video_class) {
                console.log("Video div found")
                the_hyperlink = document.querySelectorAll("video")
                the_videoName = document.querySelectorAll(".video-name")
                the_week = document.querySelectorAll('.rc-Breadcrumbs')
                if (the_hyperlink.length != 0) {
                    console.log(the_hyperlink[0].src);
                    console.log(the_videoName[0].textContent)
                    chrome.runtime.sendMessage(
                        {
                            "identity": "Downloader",
                            "theHyperlink": the_hyperlink[0].src,
                            "theFolderName": the_week[0].children[0].children[0].children[0].text.replace(/\/|\s|\?/g, ''),
                            "theVideoName": the_videoName[0].textContent.replace(/\/|\s|\?/g, ''),
                            "theWeek": the_week[0].children[0].children[2].children[0].text.replace(/\/|\s|\?/g, '')
                        }
                    )
                    deleteInterval(findMainContainer)

                } else {
                    chrome.runtime.sendMessage(
                        {
                            "identity": "Downloader",
                            "theHyperlink": "NotFound",
                            "theFolderName": null,
                            "theVideoName": null,
                            "theWeek": null
                        }
                    )
                    deleteInterval(findMainContainer)

                }

            } else if (the_target_div.className == the_supreading_class) {
                console.log("Supplementary Reading found")
                sup_title = document.querySelectorAll('.reading-title')[0].children[0].textContent
                all_links = document.querySelectorAll("a")
                the_links = []
                for (var num = 28; num < all_links.length; num++) {
                    the_links.push(all_links[num].href)
                }
                if (sup_title.length != 0) {
                    chrome.runtime.sendMessage(
                        {
                            "identity": "Supplementary",
                            "theTitle": sup_title,
                            "theLinks": the_links
                        }
                    )
                    deleteInterval(findMainContainer)

                }
            } else {
                console.log("No Video or Supplementary Reading found")
                chrome.runtime.sendMessage(
                    {
                        "identity": "Downloader",
                        "theHyperlink": "NotFound",
                        "theFolderName": null,
                        "theVideoName": null,
                        "theWeek": null
                    }
                )
                deleteInterval(findMainContainer)
            }
        } else {
            console.log("Container not found")
        }
    }, 200)



}

function deleteInterval(which) {
    clearInterval(which)
}