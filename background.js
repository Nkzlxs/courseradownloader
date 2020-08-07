// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

let counter = 0;

chrome.runtime.onInstalled.addListener(function () {
    console.log("Extension installed");
});

chrome.commands.onCommand.addListener(function (command) {
    console.log("Input commands: ", command)
    if (command == "download_video") {
        downloadVideo()
    } else if (command == "next_section") {
        chrome.tabs.onUpdated.addListener(tabfinishupdate)
        chrome.runtime.onMessage.addListener(onMSG)
    } else if (command == "kill") {
        /*
        chrome.downloads.search({ "exists": true }, function (DownloadItems) {
            console.log(DownloadItems)
            for (var i in DownloadItems) {
                console.log(DownloadItems[i].id)
                chrome.downloads.cancel(DownloadItems[i].id);
            }
        })
        */
        chrome.tabs.onUpdated.removeListener(tabfinishupdate)
        chrome.runtime.onMessage.removeListener(onMSG)
    }
})

function jumpNextLink() {
    console.log("Trying to jump link")
    chrome.tabs.executeScript(
        {
            "file": "nextHyperlink.js"
        }
    )
}

function downloadVideo() {
    console.log("Trying to dl video")
    chrome.tabs.executeScript(
        {
            "file": "processHyperlink.js"
        }
    )
}

function tabfinishupdate(tabid, changeinfo, tab) {
    if (changeinfo.status == "complete") {
        // To prevent overfires i thought onUpdate only fire once
        downloadVideo()
    }
}

function onMSG(msg, sender, sendResponse) {
    if (msg.identity == "Downloader") {
        console.log("MSG IDENTITY IS DOWNLOADER")
        if (msg.theHyperlink != null) {
            console.log("DOWNLOADING VIDEO:" + msg.theHyperlink)
            chrome.downloads.download(
                { "url": msg.theHyperlink, "saveAs": false, "filename": "./" + msg.theFolderName + "/" + msg.theWeek + "/video_" + msg.theVideoName + "_" + counter + ".webm" }
            )
            counter++
            jumpNextLink()
        } else if (msg.theHyperlink == "NotFound") {
            console.log("Hyperlink is NotFound")
            jumpNextLink()
        }
    }
    if (msg.identity == "NextLink") {
        console.log("MSG IDENTITY IS NEXTLINK")
        if (msg.theNextLink != "NotFound") {
            console.log("UPDATING LINK TO" + msg.theNextLink)
            chrome.tabs.update(
                sender.tab.id,
                { "url": msg.theNextlink },
                function () {
                    console.log("PAGE UPDATED")
                }
            )
        } else if (msg.theNextLink == "NotFound") {
            console.log("Next link is NotFound")
        }
    }
    if (msg.identity == "Supplementary") {
        console.log("MSG IDENTITY IS SUPPLEMENTARY")
        console.log(msg.theTitle)
        console.log(msg.theLinks)
        jumpNextLink()
    }
}