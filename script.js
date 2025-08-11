var anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmbHZobWRwc2l2bnJlbnVxZ3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODEyMzcsImV4cCI6MjA2OTU1NzIzN30.lxCXZaqZm2aWzmyDWBNc5CEhYtb-6lxn_zvECVv6t8c";
var url = "https://vflvhmdpsivnrenuqgzs.supabase.co";

var supa = supabase.createClient(url, anon);

function displayImages() {
  var data = [];
  document.querySelector('.listImages').innerHTML = "Loading images...";
  console.log("Fetch started");
  supa.storage.from("images").list("")
    .then(function(result) {
      document.querySelector('.listImages').innerHTML = "";
      // Use indexOf instead of startsWith for compatibility
      data = result.data.filter(function(i) { return i.name.indexOf(".") !== 0; });
      console.log("Fetch ended");
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          var url = supa.storage.from("images").getPublicUrl(data[i].name).data.publicUrl;
          var div = document.createElement("div");
          div.className = "row";
          div.innerHTML = 
            '<p>' + data[i].name + '</p>' +
            '<img onclick="fullscreen(event)" width="200" src="' + url + '" alt="image_not_found" loading="lazy">';
          document.querySelector('.listImages').appendChild(div);
        }
      } else {
        document.querySelector('.listImages').innerHTML = "No images added yet";
      }
    })
    .catch(function(error) {
      console.error('Promise Catch:', error);
      document.querySelector('.listImages').innerHTML = "Failed to load image";
    });
}

function fullscreen(event) {
  var elem = event.target;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

displayImages();