import data from "./data.js"


const musicListElement = document.querySelector('.music__list')
const formElement = document.querySelector("form")
const input = document.querySelectorAll('form input[type=text]')
const inputImage = document.querySelector('form input[type=file]')
let image = ""
let newData = []


// loader when user add success
function loader(time){
    const loaderElement = document.querySelector(".loader");

    loaderElement.classList.add('active')
    setTimeout(() => {
        loaderElement.classList.remove('active')

    }, time)
}



// faild querry
function getData(){
    if(Math.random() < 0.75) return data
    else throw new Error("querry faild")
}

try {
    newData = getData()
} catch (error) {
    alert(error)
}


// show list data to screen
function show(array){
    let html = ''

    console.log(array)
    if(array.length === 0){
        html = ``
    }else{
        // ./content/demo-content.html?id=${val.id}
        array.forEach((val, item) => {
            html += `
            <div class="music__item" data="${val.id}">
                <a href="#">
                    <div class="music__image">
                        <img src="${val.avatar}" alt="">
                    </div>
                </a>
                <a href="#" class="music__title overflow">${val.title}</a>
                <span class="music__singer overflow">${val.creator}</span>
            </div>
            `
        })
        
    }


    
    // musicListElement.style.display = 'none'
    musicListElement.innerHTML = html
}

// receive image from input
inputImage.addEventListener("change", function() {
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


formElement.onsubmit = e => {
    e.preventDefault()

    const name = input[0].value;
    const nameSinger = input[1].value

    // check all input when user press btn submit
    input.forEach(item => {
        if(item.value === ""){
            item.parentElement.classList.add('active')
        }
    })
    // check image
    if(image === ""){
        inputImage.parentElement.classList.add('active')
    }

    // if all field has data then add song 
    if(name !== "" && nameSinger !== "" && image.length > 0){
        inputImage.parentElement.classList.remove('active')

        const  obj = {
            "id": newData.length + 1,
            "avatar": image,
            "creator": nameSinger,
            "title": name,
            "lyric": ["khong co loi bai hat"]
        }
        addSong(obj)
        input.forEach(item => item.value = "" )
    }else{
        console.log("lỗi")
    }

}

// add song into list data
function addSong(obj){
    loader(2000)
    // after two second will run
    setTimeout(() => {
        newData.push(obj)
        show(newData)
        modal(newData)

    },2000)
}


// hide error when user entering data
input.forEach(item => {
    item.oninput = (e) =>{
        if(e.target.value.length > 0){
            item.parentElement.classList.remove('active')
        }
    }
})

// show error when user onblur input with emty value
input.forEach(item => {
    item.onblur = (e) =>{
        if(e.target.value == ""){
            item.parentElement.classList.add('active')
        }
    }
})




show(newData)
function modal(data){
    const itemElement = document.querySelectorAll('.music__item')
    const modal = document.querySelector('.modal')
    let audio
    let isPlaying = true

    itemElement.forEach(item => {
        item.addEventListener('click', function(){
            const id = this.getAttribute("data")
            modal.classList.toggle('active')
            showModal(id)
        })
    })

    function showModal(id){
        const modalBodyElement = document.querySelector('.modal__container')
        const obj = data[id - 1]
        const html = `
        <div class="modal__header">
            <div class="modal__close">
                <i class="fas fa-times"></i>
            </div>
        </div>
        <div class="modal__body">
            <div class="song">
                <div class="song__info">
                    <div class="song__disc">
                        <img src="${obj.avatar}" alt="">
                    </div>
                    <span class="song__name">${obj.title}</span>
                    <span class="song__singer">${obj.creator}</span>
                </div>
                <div class="control">
                    <div class="btn btn-repeat">
                        <i class="fas fa-redo"></i>
                    </div>
                    <div class="btn btn-prev">
                        <i class="fas fa-step-backward"></i>
                    </div>
                    <div class="btn btn-play btn-toggle-play">
                        <i class="fas fa-pause icon-pause"></i>
                        <i class="fas fa-play icon-play"></i>
                    </div>
                    <div class="btn btn-next">
                        <i class="fas fa-step-forward"></i>
                    </div>
                    <div class="btn btn-random">
                        <i class="fas fa-random"></i>
                    </div>
                </div>

                <input id="progress" class="progress" type="range" value="0" step="1" min="0" max="100">

            </div>
            <div class="song__lyrics">
                <span>Lời bài hát: ${obj.title}</span>
                <p>${obj.lyric.map(val => {
                    return val + '<br>'
                }).join('')}</p>
            </div>
        </div>
        <div class="modal__footer">
            <button class="footer__btn">Xem Chi Tiết</button>
        </div>
        `
        // set content in modal
        modalBodyElement.innerHTML = html

        const btnClose = document.querySelector('.modal__close')
        btnClose.addEventListener('click', function(){
            modal.classList.remove('active')
            if(audio){
                audio.pause()
            }
        })
        
        // cd
        const cdThumb = document.querySelector('.song__disc')
        const cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 10000,
            iterations: Infinity,
        })

        // click btn will direction 
        const btnViewDetail = document.querySelector('.footer__btn')
        btnViewDetail.addEventListener('click', function(){
            window.open(`http://127.0.0.1:5500/page/content/demo-content.html?id=${obj.id}`)
            btnClose.click()
        })


        // play music when open modal
        if(obj.music){
            const music = obj.music.slice(3,obj.music.length)
            audio = new Audio(music)
            audio.play()
        }

        const playBtn = document.querySelector('.btn-toggle-play')
        const player = document.querySelector('.control')
        const progress = document.querySelector('.progress')
        const nextBtn = document.querySelector('.btn-next')
        const prevBtn = document.querySelector('.btn-prev')

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

        if(audio){
            audio.ontimeupdate = function() {
                if (audio.currentTime) {
                    progress.value = audio.currentTime / audio.duration * 100
                }
            }
    
            progress.oninput = function() {
                const newProgress = progress.value;
                const seek = audio.duration / 100 * newProgress;
                audio.currentTime = seek
            }
        }

        nextBtn.addEventListener('click', () => {
           changeSong(data, obj, 1)
        })
        prevBtn.addEventListener('click', () => {
            changeSong(data, obj, -1)
         })
    }

    function changeSong(data,obj, n){
        if(audio){
            audio.pause()
        }
        let newId = obj.id + n
        if(newId > data.length){ newId = 1 }
        if(newId < 1){ newId = data.length }
        showModal(newId)
    }


}

modal(newData)