// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

let counter = 0;
let interval_counts = 0;
let continue_flag = false
let oneway = true;
let dl = null;

chrome.runtime.onInstalled.addListener(function () {
    console.log("Extension installed");
});

chrome.commands.onCommand.addListener(function (command) {
    console.log("Input commands: ", command)
    if (command == "download_video") {
        downloadVideo()
    } else if (command == "next_section") {
        // downloadVideo()
        // jumpNextLink()
        // interval_counts = 0
        // setInterval(function () {
        //     downloadVideo()
        //     jumpNextLink()
        // }, 10000)

        // chrome.tabs.onUpdated.addListener(jumpNextLink)
        // chrome.downloads.onCreated.addListener(jumpNextLink)
        // chrome.downloads.onChanged.addListener(updateCheck)
        // chrome.tabs.onUpdated.addListener(updateCheck)
        // jumpNextLink()
        chrome.webNavigation.onCompleted.addListener(function () {
            downloadVideo()
        })
        chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
            console.log(msg)
            if (msg.identity == "Downloader") {
                if (msg.theHyperlink != null) {
                    chrome.downloads.download(
                        { "url": msg.theHyperlink, "saveAs": false, "filename": "./Google_IT_Support/" + msg.theWeek + "/video_" + msg.theVideoName + ".webm" }
                    )
                } else if (msg.theHyperlink == "NotFound") {
                    console.log("Hyperlink is NotFound")
                }
                jumpNextLink()
            } else if (msg.identity == "NextLink") {
                if (msg.theNextLink != null) {
                    chrome.tabs.update(
                        { "url": data.theNextlink }
                    )
                } else if (msg.theNextLink == "NotFound") {
                    console.log("Next link is NotFound")
                }
            }

        })
    } else if (command == "kill") {
        // chrome.tabs.onUpdated.removeListener(jumpNextLink)
        // chrome.downloads.onCreated.removeListener(jumpNextLink)
        // chrome.downloads.onChanged.removeListener(updateCheck)
        // chrome.tabs.onUpdated.removeListener(updateCheck)
        chrome.downloads.search({ "exists": true }, function (DownloadItems) {
            console.log(DownloadItems)
            for (var i in DownloadItems) {
                console.log(DownloadItems[i].id)
                chrome.downloads.cancel(DownloadItems[i].id);
            }
        })
        // chrome.webNavigation.onCompleted.removeListener(dlcheck)
        // chrome.management.setEnabled("icclgolembhgcbdgccmgjeffkmkcmclh", false)
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
