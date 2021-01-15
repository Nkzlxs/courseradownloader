processHyperLink()
function processHyperLink() {
    console.log("Processing Hyperlink!")
    let findMainContainer = setInterval(function () {
        the_container = document.querySelectorAll('div[data-id="item-scroll-container"]')
        the_video_class = "rc-VideoItemWithHighlighting"
        the_supreading_class = "rc-ItemBox rc-ReadingItem"
        the_target_div = the_container[0].children[0].children[0]

        if (the_container.length != 0) {
            console.log("Container Found")
            if (the_target_div.className == the_video_class) {
                console.log("Video div found")
                let data = {
                    "the_hyperlink": document.querySelectorAll("video")[0].src,
                    "the_videoName": document.querySelectorAll(".video-name")[0].textContent.replace(/\/|\s|\?|\:/g, ''),
                    "the_foldername": document.querySelectorAll('.rc-Breadcrumbs')[0].children[0].children[0].children[0].text.replace(/\/|\s|\?|\:/g, ''),
                    "the_week": document.querySelectorAll('.rc-Breadcrumbs')[0].children[0].children[2].children[0].text.replace(/\/|\s|\?|\:/g, '')
                }

                if (data.the_hyperlink.length != 0) {
                    chrome.runtime.sendMessage(
                        {
                            "identity": "Downloader",
                            "theHyperlink": data.the_hyperlink,
                            "theFolderName": data.the_foldername,
                            "theVideoName": data.the_videoName,
                            "theWeek": data.the_week
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
                sup_title = ""
                try {
                    sup_title_container = document.querySelectorAll('.reading-title')
                    sup_title = sup_title_container[0].children[0].textContent
                } catch (e) {
                    console.log(e)
                }

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