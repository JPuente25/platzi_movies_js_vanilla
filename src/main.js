const API_KEY = '1af41b623e681d424fd48b25d8b33e10';
const URL_TMDB = 'https://api.themoviedb.org/3'

let loadCategoriesPreviewList = false;

const fetchApi = axios.create({
   baseURL: 'https://api.themoviedb.org/3',
   params:{
      'api_key': API_KEY,
   }
})

const getCategoriesPreviewList  = async () => {
   try{
         const {data,status} = await fetchApi.get('/genre/movie/list');
         if(status === 200){
            createCategories(data,categoriesPreviewList);
         }        
   } catch(error){
      console.error(error);
   }
}

const getTrendingMoviesPreview = async () => {
   try{
         const {data,status} = await fetchApi.get('/trending/movie/day')
         if(status === 200){
            elementHTMLCreator({
               data:data,
               baseClass: 'movie-container',
               mainClass: 'movie-container-preview',
               parent: trendingMoviesPreviewList,
            });
         }
   } catch (error){
      console.error(error);
   }
}

const getMoviesByCategory = async (hash) => {
   try{
      const [categoryId, categoryName] = hash.split('=')[1].split('-');
      headerCategoryTitle.innerHTML = categoryName.replace('%20',' ');
      const {data,status} = await fetchApi.get('/discover/movie',{
         params: {
            'with_genres': categoryId,             
         },
      })
      if(status === 200){
         elementHTMLCreator({
            data:data,
            baseClass: 'movie-container',
            mainClass: 'movie-container-category',
            parent: genericSection,
         });
      }
   } catch (error){
      console.error(error);
   }
};

const searchMovie = async (hash) => {
   try{
      const movieName = hash.split('=')[1];
      const {data,status} = await fetchApi.get('/search/movie',{
         params:{
            'query': movieName,
         }
      })
      if(status === 200){
         elementHTMLCreator({
            data: data,
            baseClass: 'movie-container',
            parent: genericSection,
         })
      }
   }catch (error){
      console.error(error);
   }
   
};

const trendingMovies = async () => {
   headerCategoryTitle.innerHTML = 'Tendencias';
   try{
      const {data, status} = await fetchApi.get('/trending/movie/day');
      if(status === 200){
         elementHTMLCreator({
            data: data,
            baseClass: 'movie-container',
            parent: genericSection,
         })
      }
   }catch (error){
      console.error(error);
   }
};

const createCategories = (data,parent) => {
   parent.innerHTML = '';
   const genres = data.genres;
   genres.forEach((genre) => {
      const categoryPreviewContainer = document.createElement('div');
      categoryPreviewContainer.classList.add('category-container');
      const categoryPreviewTitle = document.createElement('h3');
      categoryPreviewTitle.classList.add('category-title');
      categoryPreviewTitle.id = `id${genre.id}`;
      categoryPreviewTitle.innerHTML = genre.name;
      categoryPreviewContainer.appendChild(categoryPreviewTitle);
      parent.appendChild(categoryPreviewContainer);

      categoryPreviewTitle.addEventListener('click',()=>{
         location.hash = `category=${genre.id}-${genre.name}`;
      }); 
   });
};

const elementHTMLCreator =  ({
   data,
   baseClass,
   mainClass = "",
   parent,
}) => {
   mainClass ||= baseClass;  
   parent.innerHTML= '';
   const elements = data.results;
   elements.forEach((element)=> {
      const elementContainer = document.createElement('div')
      elementContainer.classList.add(baseClass,mainClass);
      const elementImg = document.createElement('img');
      elementImg.classList.add('movie-img');
      elementImg.alt = element.title;
      elementImg.src = `https://image.tmdb.org/t/p/w300${element.poster_path}`; 
      elementContainer.appendChild(elementImg);
      parent.appendChild(elementContainer);

      elementContainer.addEventListener('click', () => {
         location.hash = `movie=${element.id}`;
      });
   })
};

const getMovieById = async (hash) => {
   try{
      const movieId = hash.split('=')[1];

      const {data,status} = await fetchApi.get(`/movie/${movieId}`);
   
      if(status === 200){
         const headerSectionLong = document.querySelector('.header-container--long');
         movieDetailTitle.innerHTML = data.original_title;
         movieDetailDescription.innerHTML = data.overview;
         movieDetailScore.innerHTML = data.vote_average;
         headerSectionLong.style.backgroundImage = "url('https://image.tmdb.org/t/p/w300"+data.poster_path+"')";
         
         createCategories(data,movieDetailCategoriesList);
         getSimilarMovies(movieId);
      }
   } catch (error){
      console.error(error);
   }; 
};

const getSimilarMovies = async (id) => {
   try{
      const {data,status} = await fetchApi.get(`/movie/${id}/similar`);
      console.log(data);
      if(status === 200){
         elementHTMLCreator({
            data: data,
            baseClass: 'movie-container',
            parent: relatedMoviesContainer,
         })
      }
   } catch(error){
      console.error(error);
   };
};