import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { searchImages } from './api-kay';


const notifyWarning = {
    width: '500px',
    fontSize: '25px',
    position: 'center-top',
    opacity: 0.7,
    timeout: 1500,
  };

const formEl = document.querySelector('.search-form');
const inputEl = document.querySelector ('input');
const galleryEl = document.querySelector('.gallery')
const loadBtn = document.querySelector('.load-more')
  
loadBtn.disabled = true
let imageName = '';
let page = 0;
let perPage = 40;
formEl.addEventListener('submit', processingRequest);
loadBtn.addEventListener('click', loadingNewData);

function processingRequest(event) {
  event.preventDefault();
  imageName = '';
  page = 0;
  galleryEl.innerHTML = '';
  loadBtn.classList.remove('block')
  if((event.action = inputEl.value === '')) {
    return  Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    
  } 
    imageName = event.action = inputEl.value;
    page += 1;

    searchImages(imageName, perPage, page) 
    .then(res => {
      if(!res.data.hits.length > 0) {
         Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        } else {
          return addCardsOnThePage(res),
          loadBtn.classList.add('block'),
          (loadBtn.disabled = false);
        }
    }).catch(e => {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    });
  }


function loadingNewData (event) {
  event.preventDefault();
  page += 1;
  searchImages(imageName, perPage, page) 
  .then(res => {
    if(!res.data.hits.length > 0) {
       Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
       
      } else {
        return addCardsOnThePage(res),
        theEndCollectionBtnLoadMore(res.data.totalHits)
        
      }
  }).catch(e => {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  });
}


function addCardsOnThePage(arr) {
  const dataCards = arr.data.hits;
  const markup = dataCards.map(
    ({
      webformatURL, 
      largeImageURL,
      tags,
      likes,
      views ,
      comments,
      downloads
    }) => {
      return `<div class="photo-card">
      <a class="gallery-link" href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" width = "300" height="250" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
            ${likes}
        </p>
        <p class="info-item">
          <b>Views</b>
            ${views}
        </p>
        <p class="info-item">
          <b>Comments</b>
            ${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
            ${downloads}
        </p>
      </div>
    </div>`
  }
  ).join('');
  return galleryEl.insertAdjacentHTML('beforeend', markup),
  new SimpleLightbox('.gallery a', { 
    captionsData: 'alt',
    captionsDelay: 250,
    disableScroll: false,
   }).refresh();
}

  
      
function theEndCollectionBtnLoadMore(total) {
  let resultOfTheCollection = page * perPage < total;
  if(!resultOfTheCollection) {
    (loadBtn.disabled = true), 
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  } else {
    return;
  }
}
    
