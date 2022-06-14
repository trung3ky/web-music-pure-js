import data from "./data.js"

// use href get path url
const urlString = window.location.href

const url = new URL(urlString)

let id = url.searchParams.get("id")

console.log(location.hash)

// id is null assgin default id = 1
if(id ===  null){
    window.location = "http://127.0.0.1:5500/page/content/demo-content.html?id=1"
}



const musicElement = document.querySelector('.song__info')
const lyricsElement = document.querySelector('.song__lyrics')
// const audio = document.querySelector('#audio')
const playBtn = document.querySelector('.btn-toggle-play')
const player = document.querySelector('.control')
const progress = document.querySelector('.progress')
const nextBtn = document.querySelector('.btn-next')
const prevBtn = document.querySelector('.btn-prev')
const listSong = document.querySelector('.container__list-song')

let isPlaying = true

const music = data[id-1]

const audio = new Audio(music.music);
audio.play();


function start(music){
    const musicHtml = `
        <div class="song__disc">
            <img src="${music.avatar}" alt="">
        </div>
        <span class="song__name">${music.title}</span>
        <span class="song__singer">${music.creator}</span>
    ` 
    
    const lyricsHtml = `
        <span>Lời bài hát: ${music.title}</span>
        <p>${music.lyric.map( val => {
            return val + '<br>'
        }).join('')}</p>
    `
    
    const listHtml = `
        <h3 class="title">Nhạc của ${music.creator}</h3>
        <div class="music__list">
            <div class="music__item image__singer">
                <div class="music__image">
                    <img src="${music.bgImage}" alt="">
                </div>
                <span class="music__singer overflow">${music.creator}</span>
            </div>
            <div class="music__item">
                <a href="./content/demo-content.html?id=1">
                    <div class="music__image">
                        <img src="${music.avatar}" alt="">
                    </div>
                </a>
                <a href="./content/demo-content.html?id=" class="music__title overflow">${music.title}</a>
                <span class="music__singer overflow">${music.creator}</span>
            </div>
        </div>
    `
    
    // start music assign content lyrics and conetent music and play music
    musicElement.innerHTML = musicHtml
    lyricsElement.innerHTML = lyricsHtml
    listSong.innerHTML = listHtml

}

function changeSong(n){
    id = Number(id) - n
    if(Number(id) < 1){
        return window.location = `./demo-content.html?id=${data.length}`
    }
    if(Number(id) > data.length){
        return window.location = `./demo-content.html?id=1`

    }
    window.location = `./demo-content.html?id=${id}`
}

start(music)


// animation cd 
const cdThumb = document.querySelector('.song__disc')

const cdThumbAnimate = cdThumb.animate([{
    transform: 'rotate(360deg)'
}], {
    duration: 10000,
    iterations: Infinity,
})



// play pause click
playBtn.onclick = function() {
    if (isPlaying) {
        audio.pause();
        player.classList.toggle('playing')
        isPlaying = false
        cdThumbAnimate.pause()
        console.log("pause")
    } else {
        audio.play();
        player.classList.toggle('playing')
        isPlaying = true
        console.log("play")
        cdThumbAnimate.play()
    }   
}

// upadte progress when audio change
audio.ontimeupdate = function() {
    if (audio.currentTime) {
        progress.value = audio.currentTime / audio.duration * 100
    }
}

// change progress
progress.oninput = function() {
    var newProgress = progress.value;
    var seek = audio.duration / 100 * newProgress;
    audio.currentTime = seek
}

// next song when end
audio.onended = function() {
    nextBtn.click()
}


// next
nextBtn.addEventListener('click', () => changeSong(-1))
//prev
prevBtn.addEventListener('click', () => changeSong(1)) 



// edit form

const name = document.querySelector('input[name="name"]')
const singer = document.querySelector('input[name="singer"]')
const lyrics = document.querySelector('textarea[name="lyrics"]')
const imageSong = document.querySelector('input[name="imageSong"]')
const imageSinger = document.querySelector('input[name="imageSinger"]')
const form = document.querySelector('form')
const btnSubmit = document.querySelector('.submit')
let image = ""
let image1 = ""


// receive image song
imageSong.addEventListener("change", function() {
    const file = this.files[0]
    if(file){
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            // iamge.setAttribute('src', this.result)
            image = this.result
        })
        reader.readAsDataURL(file)
    }else{
        image = ""
    }
})

// receive image singer
imageSinger.addEventListener("change", function() {
    const file = this.files[0]
    if(file){
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            // iamge.setAttribute('src', this.result)
            image1 = this.result
        })
        reader.readAsDataURL(file)
    }else{
        image1 = ""
    }
})

// assign data into input
var arryElement = [name, singer, lyrics]
function showDataIntoInput(data){
    // const image = document.querySelector('input[name="name"')

    name.value = data.title
    singer.value = data.creator
    lyrics.value = data.lyric

    arryElement.forEach( item => {
        item.addEventListener('blur', function(event){
            hanldeBlur(event, this)
        })   
        item.addEventListener('input', function(event){
            hanldeOnInput(event, this)
        })   
    })


}

// hanlde onblur
function hanldeBlur(e, item){
    if(e.target.value == ""){
        item.parentElement.classList.add('active')
    }
}
// hanlde oninput
function hanldeOnInput(e, item){
    if(e.target.value.length > 0){
        item.parentElement.classList.remove('active')
    }
}



// press btn submit
form.onsubmit = function(e){
    e.preventDefault()

    // show error if input type text is emty
    arryElement.forEach(item => {
        if(item.value === ""){
            item.parentElement.classList.add('active')
        }
    })

    // if all field has data then create a obj and call editsong
    if(name.value !== "" && singer.value !== "" && lyrics.value !== ""){
        if(image === "") { image = music.avatar}
        if(image1 === "") { image1 = music.bgImage}
        const  obj = {
            "avatar": "",
            "creator": singer.value,
            "title": name.value,
            "lyric": lyrics.value.split(','),
            "avatar": image,
            "bgImage": image1
        }
        editSong(obj)
    }else{
        console.log("lỗi")
    }
}

// handle edit song
function editSong(obj){ 
    loader(2000)
    setTimeout(function(){
        const newMusic = {...music}
    
        newMusic.title = obj.title;
        newMusic.creator = obj.creator;
        newMusic.lyric = obj.lyric;
        newMusic.avatar = obj.avatar
        newMusic.bgImage = obj.bgImage

        start(newMusic)

        const cdThumb = document.querySelector('.song__disc')

        const cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 10000,
            iterations: Infinity,
        })



    }, 2000)
}

// handle load
function loader(time){
    const loaderElement = document.querySelector(".loader");

    loaderElement.classList.add('active')
    setTimeout(() => {
        loaderElement.classList.remove('active')

    }, time)
}

showDataIntoInput(music)
