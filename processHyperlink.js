processHyperLink()
function processHyperLink() {
    let findMainContainer = setInterval(function () {
        the_container = document.querySelectorAll('div[data-id="item-scroll-container"]')
        the_videodiv = document.querySelectorAll('.rc-VideoItemWithHighlighting')
        the_supreading = document.querySelectorAll(".rc-ItemBox.rc-ReadingItem")

        if (the_container.length != 0) {
            console.log("Container Found")
            if (the_videodiv.length != 0) {
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
                            "theVideoName": null,
                            "theWeek": null
                        }
                    )
                    deleteInterval(findMainContainer)

                }

            } else if (the_supreading.length != 0) {
                console.log("Supplementary Reading found")
                sup_title = document.querySelectorAll('.reading-title')[0].children[0].textContent
                if (sup_title.length != 0) {
                    chrome.runtime.sendMessage(
                        {
                            "identity": "Supplementary",
                            "theTitle": sup_title,
                            "the_links": null //Get done soon
                        }
                    )
                    deleteInterval(findMainContainer)

                }
            } else if (the_videodiv.length == 0 && the_supreading.length == 0) {
                console.log("No Video or Supplementary Reading found")
                chrome.runtime.sendMessage(
                    {
                        "identity": "Downloader",
                        "theHyperlink": "NotFound",
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