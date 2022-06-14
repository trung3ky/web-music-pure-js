
// variable
const sliderList = document.querySelector('.slider__líst')
const sliderItem = document.querySelectorAll('.slider-item')
const dots =document.querySelectorAll('.dot__item')

let currentpage = 0
let totalPage = 3


// set width of slider list and slider item
function start(){
    const width = window.innerWidth
    
    for(let i = 0; i < sliderItem.length; i++){
        sliderItem[i].style.width = width + 'px';
    }
    sliderList.style.width = width * 3 + 'px'
}

// carousel
function showslide(pagenumber){
    sliderList.style.marginLeft = -(window.innerWidth * pagenumber)+'px'

    if(document.querySelector('.dot__item.active')){
        document.querySelector('.dot__item.active').classList.remove('active')
    }

    dots[currentpage].classList.add('active')
}

// change width of slider list when width of screen change
window.onresize = function(){
    start()
    showslide(currentpage)
}       

// click dots
function currentSlider(n){
    currentpage = n
    showslide(n)
}

// click btn left and right
function clickBtn(n){
    currentpage = currentpage + n
    if(currentpage < 0)  currentpage = totalPage - 1
    if(currentpage > totalPage -1 )   currentpage = 0
    showslide(currentpage);
}

start()

showslide(0)