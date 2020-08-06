
theNextlink = document.querySelectorAll('a[aria-label="Next Item"]')
if (theNextlink.length != 0) {
    console.log(theNextlink[0].href);
    chrome.storage.local.set(
        { "theNextlink": theNextlink[0].href }
    )
} else {
    chrome.storage.local.clear()
}

