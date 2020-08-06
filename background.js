// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

let counter = 0;
let interval_counts = 0;
let continue_flag = false
let oneway = true;
let dl = null;

chrome.runtime.onInstalled.addListener(function () {

    chrome.storage.sync.set({ color: '#3aa757' }, function () {
        console.log("Storage saved a green color 3aa757")
    })


    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { hostEquals: 'developer.chrome.com' },
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
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
        setInterval(function () {
            downloadVideo()
            jumpNextLink()
        }, 10000)

        // chrome.tabs.onUpdated.addListener(jumpNextLink)
        // chrome.downloads.onCreated.addListener(jumpNextLink)
        // chrome.downloads.onChanged.addListener(updateCheck)
        // chrome.tabs.onUpdated.addListener(updateCheck)
        chrome.downloads.onCreated.addListener(dlcheck)
    } else if (command == "kill") {
        // chrome.tabs.onUpdated.removeListener(jumpNextLink)
        // chrome.downloads.onCreated.removeListener(jumpNextLink)
        // chrome.downloads.onChanged.removeListener(updateCheck)
        // chrome.tabs.onUpdated.removeListener(updateCheck)
        chrome.downloads.onCreated.removeListener(dlcheck)
        chrome.management.setEnabled("icclgolembhgcbdgccmgjeffkmkcmclh", false,)
    }
})

function jumpNextLink() {
    console.log("Trying to jump link")
    chrome.tabs.executeScript(
        {
            "file": "nextHyperlink.js"
        },
        function () {
            chrome.storage.local.get("theNextlink", function (data) {
                if (data.theNextlink != null) {
                    console.log(data.theNextlink)
                    // chrome.tabs.create(
                    //     { "url": data.theNextlink, "active": true }
                    // )
                    chrome.tabs.update(
                        { "url": data.theNextlink }
                    )
                    oneway = true
                } else {
                    console.log("Nextlink is null")

                }

            }

            )
        }
    )
}

function downloadVideo() {
    console.log("Trying to dl video")
    chrome.tabs.executeScript(
        {
            "file": "processHyperlink.js"
        },
        function () {
            chrome.storage.local.get(["theHyperlink", "theVideoName", "theWeek"], function (data) {
                if (data.theHyperlink != null) {

                    console.log(data.theHyperlink)

                    // chrome.tabs.create(
                    //     { "url": data.theHyperlink, "active": true }
                    // )
                    chrome.downloads.download(
                        { "url": data.theHyperlink, "saveAs": false, "filename": "./Google_IT_Support/" + data.theWeek + "/video_" + data.theVideoName + "_" + counter + ".webm" }
                    )
                    counter++
                    interval_counts = -1;
                } else {
                    console.log("Hyperlink is null")
                    interval_counts++
                }
            })
        }

    )
}


// let progress = null;
// function updateCheck(tabId, changeInfo, tab) {


//     // console.log("Current is null")

// }

function dlcheck(dlitem) {
    // console.log(changeInfo.status)
    console.log(oneway)
    console.log(dl)

    // progress = changeInfo.status;
    // jumpNextLink(downloadVideo)
    if (oneway == true) {
        oneway = false;
        dl = setInterval(downloadVideo, 5000)
        // after 30s
        if (interval_counts >= 5 || interval_counts == -1) {
            console.log(interval_counts + " clearing interval!")
            clearInterval(dl)

            jumpNextLink()
        }
    }
}