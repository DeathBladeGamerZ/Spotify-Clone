let currentSong = new Audio();
async function FetchSongs() {
  let a = await fetch("http://127.0.0.1:5500/Songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/Songs/")[1]);
    }
  }
   return songs
}

const playMusic= (track, pause = false)=>{
  // let audio = new Audio("/Songs/"+track)
  currentSong.src = "/Songs/"+track;
  if(!pause){
    currentSong.play();
    play.src = "Assets/pausebtn.svg";
  }
  
  
  sname.innerHTML=decodeURI(track) ;
}

function convertSeconds(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${Math.floor(remainingSeconds).toString().padStart(2, '0')}`;
}


async function main() { 
  
  let songs = await FetchSongs();
  playMusic(songs[0],true);

  // var audio = new Audio(songs[0]);
  // audio.play();

  // audio.addEventListener("loadeddata",()=>{
  //   let duration = audio.duration; 
  //   console.log(duration);
  // })

  let songUl = document.querySelector(".slist").getElementsByTagName("ul")[0]
  for(const song of songs){
    songUl.innerHTML = songUl.innerHTML + `<li>
                <div class="songdetail">
                  <img src="Assets/musicicon.svg" />
                  <div class="sname">
                    <p>${song.replaceAll("%20"," ")}</p>
                    <p>Artist Name</p>
                  </div>
                  <img src="Assets/play-button-svgrepo-com.svg" />
                </div>
              </li>`;
  }
  Array.from(document.querySelector(".slist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
      console.log(e.querySelector(".sname>p"))
       playMusic(e.querySelector(".sname>p").innerHTML)
    })
  })
  play.addEventListener("click",()=>{
    if(currentSong.paused){
      currentSong.play();
      play.src = "Assets/pausebtn.svg";
    }
    else{
      currentSong.pause()
      play.src = "Assets/play-btn.svg";
    }
  })
  currentSong.addEventListener("timeupdate",()=>{
    currtime.innerHTML = convertSeconds(currentSong.currentTime);
    ttime.innerHTML= convertSeconds(currentSong.duration);
    document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration*100)+"%";
  })

  document.querySelector(".seekbar").addEventListener("click",e=>{
    percent = (e.offsetX/e.target.getBoundingClientRect().width)*100 ;
    document.querySelector(".circle").style.left = percent+"%" ;
    currentSong.currentTime=(percent * currentSong.duration)/100;
  })

  document.querySelector(".icon").addEventListener("click",()=>{
    document.querySelector(".left-main").style.left="0";
  })
  document.querySelector(".cancel").addEventListener("click",()=>{
    document.querySelector(".left-main").style.left="-100%";
  })
}
main();