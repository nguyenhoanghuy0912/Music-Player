/* STEP
1, Render songs
2, scrollTop
3, play, pause, seek
4, cd rotate
5, next / prev
6, random
7, next / repeat when ended
8, active song
9, scroll active song into view
10, play song when click
 */
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const player = $(".player")
const heading = $("header h2")
const cdThumb = $(".cd-thumb")
const audio = $("#audio")
const cd = $(".cd")
const playBtn = $(".btn-toggle-play")
const progress = $("#progress")
const nextBtn = $(".btn-next")
const prevBtn = $(".btn-prev")
const randomBtn = $(".btn-random")
const repeatBtn = $(".btn-repeat")
const playlist = $(".playlist")

const app = {
  currentIndex: 0,
  isPlay: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Beautiful In White",
      singer: "Shane Filan",
      path: "./assets/music/Beautiful In White.mp3",
      image: "./assets/img/picture 1.jfif",
    },
    {
      name: "Everytime We Touch",
      singer: "Cascada",
      path: "./assets/music/Everytime We Touch.mp3",
      image: "./assets/img/picture 2.jpg",
    },
    {
      name: "I do",
      singer: "@911",
      path: "./assets/music/I Do.mp3",
      image: "./assets/img/picture 3.jpg",
    },
    {
      name: "Reality",
      singer: "Lost Frequencies",
      path: "./assets/music/Reality.mp3",
      image: "./assets/img/picture 4.jpg",
    },
    {
      name: "See You Again",
      singer: "Charlie Puth",
      path: "./assets/music/See You Again.mp3",
      image: "./assets/img/picture 5.jfif",
    },
    {
      name: "Shape Of You",
      singer: "Ed Sheeran",
      path: "./assets/music/Shape Of You.mp3",
      image: "./assets/img/picture 6.jfif",
    },
    {
      name: "Tie Me Down",
      singer: "DuhéLyrics",
      path: "./assets/music/Tie Me Down.mp3",
      image: "./assets/img/picture 7.jfif",
    },
    {
      name: "Until You",
      singer: "Shayne Ward",
      path: "./assets/music/Until You.mp3",
      image: "./assets/img/picture 8.jfif",
    },
    {
      name: "Nevada",
      singer: "Vicetone",
      path: "./assets/music/Nevada.mp3",
      image: "./assets/img/picture 9.jfif",
    },
    {
      name: "Westlife",
      singer: "Gonna",
      path: "./assets/music/Westlife.mp3",
      image: "./assets/img/picture 10.jfif",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song  ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex]
      },
    })
  },
  handleEvent: function () {
    //xử lý phóng to, thu nhỏ của CD
    const cdWidth = cd.offsetWidth
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const newCdWidth = cdWidth - scrollTop
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0
      cd.style.opacity = newCdWidth / cdWidth
    }

    //xử lý khi quay, dừng cd
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000, //10 seconds
        iterations: Infinity, //iteration(lặp bao niêu lần), infinity: vô hạn
      }
    )
    cdThumbAnimate.pause()

    //xử lý khi click play
    playBtn.onclick = function () {
      if (app.isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
    }
    //khi song đc play
    audio.onplay = function () {
      app.isPlaying = true
      player.classList.add("playing")
      cdThumbAnimate.play()
    }
    //khi song bị pause
    audio.onpause = function () {
      app.isPlaying = false
      player.classList.remove("playing")
      cdThumbAnimate.pause()
    }

    //thời gian bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100)
        progress.value = progressPercent
      }
    }

    //xử lý tua song
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value
      audio.currentTime = seekTime
    }

    //khi next song
    nextBtn.onclick = function () {
        if(app.isRandom){
            app.playRandom()
        }
        else{
            app.nextSong()
        }
        audio.play()
        app.render()
        app.scrollToActiveSong()
    }
     //khi prev song
     prevBtn.onclick = function () {
        if(app.isRandom){
            app.playRandom()
        }
        else{
            app.prevSong()
        }
        audio.play()
        app.render()
        app.scrollToActiveSong()
    }

    //xử lý bật tắt random song
    randomBtn.onclick = function(e){
        app.isRandom = !app.isRandom
        randomBtn.classList.toggle('active', app.isRandom)
    }

    //xử lý khi repeat song
    repeatBtn.onclick = function(e){
      app.isRepeat = !app.isRepeat
      repeatBtn.classList.toggle('active', app.isRepeat)
    }

    //xử lý audio khi ended
    audio.onended = function () {
      if(app.isRepeat){
        audio.play()
      }
      else{
        nextBtn.click()
        }
    }

    //lắng nghe click vào playlist
    playlist.onclick = function(e){
      const songNode = e.target.closest('.song:not(.active)')

      if(songNode || e.target.closest('.option')){
        if(songNode){
          app.currentIndex = Number(songNode.dataset.index )//songNode.getAttribute("data-index") == songNode.dataset.index
          app.loadCurrentSong()
          app.render()
          audio.play()
        }
      }
    }
  },
  scrollToActiveSong : function(){
    setTimeout(()=>{
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }, 300)
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`
    audio.src = this.currentSong.path
  },
  nextSong: function () {
    this.currentIndex++
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },
  prevSong: function () {
    this.currentIndex--
    if(this.currentIndex < 0){
        this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong()
  },
  playRandom: function(){
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    //định nghĩa các thuộc tính cho object
    this.defineProperties()

    //lắng nghe, xử lý các sự kiện
    this.handleEvent()

    //tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong()

    //render playlist
    this.render()
  },
}
app.start();
