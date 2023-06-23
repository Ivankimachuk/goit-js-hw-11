import axios from "axios";
export { searchImages };

async function searchImages(name, perPg, pag) {
    const pixabayUrl = 'https://pixabay.com/api/';
    const apiKay = '?key=37681157-cf2a0984d19e57970fb41f251';
    const requestLineList = '&image_type=photo&orientation=horizontal&safesearch=true';
    const response = await axios.get(`${pixabayUrl}${apiKay}&q=${name}${requestLineList}&per_page=${perPg}&page=${pag}`)
    return response;
    
}
