let currentSong = new Audio();
let songs;
let currFolder ;
async function FetchSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
    let songUl = document.querySelector(".slist").getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li>
                <div class="songdetail">
                  <img src="Assets/musicicon.svg" />
                  <div class="sname">
                    <p>${song.replaceAll("%20", " ")}</p>
                  </div>
                  <img src="Assets/play-button-svgrepo-com.svg" />
                </div>
              </li>`;
  }
  Array.from(
    document.querySelector(".slist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".sname>p").innerHTML);
    });
  });
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "Assets/pausebtn.svg";
  }

  sname.innerHTML = decodeURI(track);
};

function convertSeconds(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${Math.floor(remainingSeconds)
    .toString()
    .padStart(2, "0")}`;
}

function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

async function main() {
  window.addEventListener("resize", setViewportHeight);
  window.addEventListener("load", setViewportHeight);

  await FetchSongs("Songs/English");
  playMusic(songs[0], true);


  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "Assets/pausebtn.svg";
    } else {
      currentSong.pause();
      play.src = "Assets/play-btn.svg";
    }
  });
  currentSong.addEventListener("timeupdate", () => {
    currtime.innerHTML = convertSeconds(currentSong.currentTime);
    ttime.innerHTML = convertSeconds(currentSong.duration);
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (percent * currentSong.duration) / 100;
  });
  const volumeSlider = document.getElementsByClassName("volumeSlider");
  volumeSlider[0].addEventListener("input", function () {
    const volume = parseInt(this.value) / 100;
    currentSong.volume = volume;
  });

  document.querySelector(".icon").addEventListener("click", () => {
    document.querySelector(".left-main").style.left = "0";
  });
  document.querySelector(".cancel").addEventListener("click", () => {
    document.querySelector(".left-main").style.left = "-120%";
  });

  document.querySelector("#prvsong").addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  document.querySelector("#nexsong").addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 > length) playMusic(songs[index + 1]);
  });

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    console.log(e);
    e.addEventListener("click", async item=>{
      songs = await FetchSongs(`Songs/${item.currentTarget.dataset.folder}`)
    })
  } )
}
main();