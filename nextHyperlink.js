nextHyperLink()
function nextHyperLink() {
    theNextlink = document.querySelectorAll('a[aria-label="Next Item"]')
    if (theNextlink.length != 0) {
        console.log(theNextlink[0].href);
        chrome.runtime.sendMessage(
            {
                "identity": "NextLink",
                "theNextlink": theNextlink[0].href
            }
        )
    } else {
        chrome.runtime.sendMessage(
            {
                "identity": "NextLink",
                "theNextlink": "NotFound"
            }
        )
    }
}



