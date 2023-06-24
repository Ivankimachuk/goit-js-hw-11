import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { searchImages } from './api-kay';


const formEl = document.querySelector('.search-form');
const inputEl = document.querySelector ('input');
const galleryEl = document.querySelector('.gallery')
const loadBtn = document.querySelector('.load-more')
loadBtn.style.display = 'none';
loadBtn.disabled = true;
let imageName = '';
let page = 0;
let perPage = 40;
let lightbox;

formEl.addEventListener('submit', processingRequest);
loadBtn.addEventListener('click', loadingNewData);

async function processingRequest(event) {
  event.preventDefault();
  imageName = '';
  page = 0;
  galleryEl.innerHTML = '';
  loadBtn.style.display = 'block';

  if (inputEl.value === '') {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    loadBtn.style.display = 'none';
    return;
  }

  imageName = inputEl.value;
  page += 1;

  try {
    const res = await searchImages(imageName, perPage, page);

    if (res.data.hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } else {
      addCardsOnThePage(res);
      loadBtn.style.display = 'block';
      loadBtn.disabled = false;
      theEndCollectionBtnLoadMore(res.data.totalHits);
      refreshSimpleLightbox();
    }
  } catch (error) {
    Notiflix.Notify.failure('Sorry, there was an error fetching images. Please try again.');
  }
}


async function loadingNewData(event) {
  event.preventDefault();
  page += 1;

  try {
    const res = await searchImages(imageName, perPage, page);

    if (res.data.hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no more images matching your search query. Please try again.');
    } else {
      addCardsOnThePage(res);
      theEndCollectionBtnLoadMore(res.data.totalHits);
      refreshSimpleLightbox();
    }
  } catch (error) {
    Notiflix.Notify.failure('Sorry, there was an error fetching more images. Please try again.');
  }
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
   galleryEl.insertAdjacentHTML('beforeend', markup);
 
}

  
function theEndCollectionBtnLoadMore (total) {
  let comparison = page * perPage < total;
  if (!comparison) {
    loadBtn.disabled = true; 
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
  } 
}

function refreshSimpleLightbox() {
  if (lightbox) {
    lightbox.destroy();
  }
  lightbox = new SimpleLightbox('.gallery a', { 
    captionsData: 'alt',
    captionsDelay: 250,
    disableScroll: false,
   });
}






