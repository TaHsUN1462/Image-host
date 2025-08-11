const anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmbHZobWRwc2l2bnJlbnVxZ3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODEyMzcsImV4cCI6MjA2OTU1NzIzN30.lxCXZaqZm2aWzmyDWBNc5CEhYtb-6lxn_zvECVv6t8c";
const url = "https://vflvhmdpsivnrenuqgzs.supabase.co";


const supa = supabase.createClient(url, anon);
document.querySelector('form').onsubmit = (e)=> {
  e.preventDefault();
  let form = e.target;
  sendFile(form)
};
async function sendFile(form){
  let file = document.getElementById('file').files[0];
  let filename = document.getElementById('filename').value.trim();
  let filePath = `${filename}_${Date.now()}`;
  const { data, error } = await supa.storage.from("images").upload(filePath, file)
  if (error) {
    console.log(error);
  }else{
    alert("Uploded")
    form.reset()
    document.querySelector('.preview').style.display = "none";
  }
  displayImages()
}
async function displayImages() {
  document.querySelector('.list').innerHTML = "Loading images...";
  console.log("Fetching...");
  const { data, error } = await supa.storage.from("images").list('');
  if (error) {
    console.error(error);
    return;
  }
  // Filter out placeholder or hidden files starting with '.'
  const images = data ? data.filter(item => !item.name.startsWith('.')) : [];
  console.log("Fetched: ", images.length);

  // Clear previous images/messages (optional)

  if (images.length === 0) {
    // Show "No images added" message
    document.querySelector('.list').innerHTML = "No image added";
  }
  // Display images
    document.querySelector('.list').innerHTML = "";
  for (let i = 0; i < images.length; i++) {
    const url = supa.storage.from("images").getPublicUrl(images[i].name).data.publicUrl;
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
    <p>${images[i].name}</p>
    <img onclick="fullscreen(event)" src="${url}" alt="image" width="100">
    <button onclick="deleteImage('${images[i].name}')">Delete</button>
    `
    document.querySelector('.list').appendChild(card);
  }
}
function deleteImage(imageName){
  if (confirm("delete?")) {
    const {error} = supa.storage.from("images").remove([imageName]);
    if (error) {
      alert("Error Deleting image")
    }else{
      alert("Deleted successfully");
      displayImages()
    }
  }
}
function showPreview(){
  let file = document.getElementById('file').files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    let src = e.target.result;
    document.querySelector('.preview').style.display = "block";
    document.querySelector('.preview').src = src;
  }
  reader.readAsDataURL(file);
}
function fullscreen(event){
  let elem = event.target;
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  }
  else if (elem.webkitRequestFullscreen){
    elem.webkitRequestFullscreen()
  }
  else if(eleme.msRequestFullscreen){
    elem.msRequestFullscreen()
  }
}
window.onload = displayImages();