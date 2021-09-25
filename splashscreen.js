const loadText = document.getElementById("loadText")
loadText.innerHTML = "Starting Nodecg Overlay Server..."
window.eApi.startNodeCG().then((val) => (loadText.innerHTML = val))
