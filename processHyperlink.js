processHyperLink()
function processHyperLink() {
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

    } else {
        chrome.runtime.sendMessage(
            {
                "identity": "Downloader",
                "theHyperlink": "NotFound",
                "theVideoName": null,
                "theWeek": null
            }
        )
    }

}

