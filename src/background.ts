(function () {
    const domain = [
        {
            domain: "www.facebook.com",
            value: "https://www.facebook.com" // (origin, referer)
        },
        {
            domain: "accountscenter.facebook.com",
            value: "https://accountscenter.facebook.com"
        }
    ];
    
    const rules: any[] = [];
    
    domain.forEach((item, index) => {
        rules.push({
            id: index+1,
            priority: index+1,
            action: {
                type: "modifyHeaders",
                requestHeaders: [
                    { header: "Origin", operation: "set", value: item.value },
                    { header: "Referer", operation: "set", value: item.value }
                ]
            },
            condition: {
                regexFilter: "^(http|https)://([a-zA-Z0-9-_\\.]*)" + item.domain.replace(/\\./g, "\\.") + "(.*?#from=extension)$",
                resourceTypes: ["xmlhttprequest"]
            }
        })
    });

    chrome.declarativeNetRequest.updateDynamicRules({addRules: rules, removeRuleIds: domain.map((v, i) => i+1)});

    // membuka tab baru saat ekstensi diklik
    chrome.action.onClicked.addListener(() => {
        chrome.tabs.create({url: chrome.runtime.getURL("index.html"), selected: true, index: 0})
    })
})();