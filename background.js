// background.js
let safeWebsites = [];
const GITHUB_RAW_URL =
  "https://raw.githubusercontent.com/farivar-tabatabaei/TheGuardianExt/main/websites.json";
const UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// INST --> Function to fetch and update websites from GitHub
async function updateWebsitesFromGithub() {
  try {
    const response = await fetch(GITHUB_RAW_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // INST --> Update local storage with new data and timestamp
    await browser.storage.local.set({
      websites: data,
      lastUpdate: Date.now(),
    });

    safeWebsites = data.safe;
    console.log("Websites list updated successfully from GitHub");
  } catch (error) {
    console.error("Error updating websites from GitHub:", error);
    // INST --> If update fails, load from local storage as fallback
    loadFromLocalStorage();
  }
}

// INST --> Function to load websites from local storage
async function loadFromLocalStorage() {
  try {
    const data = await browser.storage.local.get(["websites", "lastUpdate"]);
    if (data.websites) {
      safeWebsites = data.websites.safe;
      console.log("Websites loaded from local storage");
    } else {
      // INST --> If no local storage, load from local file as fallback
      const response = await fetch(browser.runtime.getURL("websites.json"));
      const defaultData = await response.json();
      safeWebsites = defaultData.safe;
      console.log("Websites loaded from local file");
    }
  } catch (error) {
    console.error("Error loading from local storage:", error);
  }
}

// INST --> Function to check if update is needed
async function checkForUpdate() {
  const data = await browser.storage.local.get("lastUpdate");
  const lastUpdate = data.lastUpdate || 0;
  const now = Date.now();

  if (now - lastUpdate >= UPDATE_INTERVAL) {
    await updateWebsitesFromGithub();
  }
}

// INST --> Initialize extension
async function initialize() {
  // INST --> First load from local storage/file
  await loadFromLocalStorage();

  // INST --> Then check for updates from GitHub
  await checkForUpdate();
}

function checkWebsiteSafety(url) {
  const domain = new URL(url).hostname.replace("www.", "");

  if (safeWebsites.some((site) => domain.includes(site))) {
    return "safe";
  }
  return "neutral";
}

function updateIcon(tabId, url) {
  const safety = checkWebsiteSafety(url);

  // INST --> Show the page action
  browser.pageAction.show(tabId);

  // INST --> Update icon and title based on safety status
  const iconPath = {
    safe: {
      16: "icons/safe/safe-16.png",
      32: "icons/safe/safe-32.png",
      48: "icons/safe/safe-48.png",
      128: "icons/safe/safe-128.png",
    },
    unsafe: {
      16: "icons/unsafe/unsafe-16.png",
      32: "icons/unsafe/unsafe-32.png",
      48: "icons/unsafe/unsafe-48.png",
      128: "icons/unsafe/unsafe-128.png",
    },
    unknown: {
      16: "icons/unknown/unknown-16.png",
      32: "icons/unknown/unknown-32.png",
      48: "icons/unknown/unknown-48.png",
      128: "icons/unknown/unknown-128.png",
    },
  };

  const titles = {
    safe: "This website is safe",
    unsafe: "Warning: This website may be unsafe",
    unknown: "Safety status unknown",
  };

  browser.pageAction.setIcon({
    tabId: tabId,
    path: iconPath[safety],
  });

  browser.pageAction.setTitle({
    tabId: tabId,
    title: titles[safety],
  });
}

// INST --> Listen for tab updates
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    updateIcon(tabId, changeInfo.url);
  }
});

// INST --> Listen for tab activation
browser.tabs.onActivated.addListener((activeInfo) => {
  browser.tabs.get(activeInfo.tabId).then((tab) => {
    if (tab.url) {
      updateIcon(tab.id, tab.url);
    }
  });
});

// INST --> Initialize when browser starts
initialize();

// INST --> Listen for browser startup to check for updates
browser.runtime.onStartup.addListener(() => {
  initialize();
});
