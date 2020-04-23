function trackTime(keyPromise) {
  const {domain, owner, project} = readOwnerAndProject();
  const entity = "github.com";
  let havenOnlyScrolledInCurrentInterval = false;

  function scrollHandler() {
    havenOnlyScrolledInCurrentInterval = true;
  }

  window.setInterval(function() {
    if (havenOnlyScrolledInCurrentInterval) {
      sendHeartbeat(preparePayload(entity, "app", project, false));
      havenOnlyScrolledInCurrentInterval = false;
    }
  }, 30000);

  function readOwnerAndProject() {
    const url = window.location.href;
    const regexp = /http[s]?:\/\/([a-zA-Z0-9]*\.[a-z]*)\/([\w-_]*)\/([\w-_]*).*/g;
    const matched = regexp.exec(url);
    const domain = matched[1];
    const owner = matched[2];
    const project = matched[3];
    return {owner: owner,
            project: project};
  }

  function preparePayload(entity, type, project, is_write) {
    return {
      entity: entity,
      type: type,
      time: (new Date).getTime()/1000,
      project: project,
      is_write: is_write,
      editor: "GitHub"
    };
  }


  function sendHeartbeat(payload) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", `https://wakatime.com/api/v1/users/current/heartbeats?api_key\=${keyPromise.key}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(payload));
  };

  function clickHandler() {
    let payload = preparePayload(entity, "app", project, true);
    sendHeartbeat(payload);
    havenOnlyScrolledInCurrentInterval = false;
  }

  window.onscroll = scrollHandler;
  document.onclick = clickHandler;
};

function keyNotProvided(error) {
  console.log("You should first configure this plugin by providing wakatime key");
}

let key = browser.storage.local.get("wakatime_apikey");
key.then(trackTime, keyNotProvided);
