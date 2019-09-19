function saveOptions(e) {
  e.preventDefault();
  let setting = browser.storage.sync.set({
    wakatime_apikey: document.querySelector("#key").value
  });
  function showSuccess() {
    document.querySelector("#success").style.display = "block";
  }

  setting.then(showSuccess);
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#key").value = result.wakatime_apikey || "";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get("wakatime_apikey");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
