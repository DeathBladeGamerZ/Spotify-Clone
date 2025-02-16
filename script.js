console.log("js");
async function FetchSongs() {
  let a = await fetch("http://127.0.0.1:5500/Songs/");
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }
   return songs
}
async function main() { 
  let songs = await FetchSongs();
  console.log(songs);

  var audio = new Audio(songs[0]);
  audio.play();
}
main(); 
