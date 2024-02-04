searchUrbanDict = function (input) {
  console.log(input)
}

chrome.contextMenus.create({
  title: 'Search in UrbanDictionary',
  contexts: ['all'], // ContextType
  onclick: searchUrbanDict, // A callback function
})
