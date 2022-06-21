const API_KEY = '1af41b623e681d424fd48b25d8b33e10';
const URL_TMDB = 'https://api.themoviedb.org/3'

const fetchApi = axios.create({
   baseURL: 'https://api.themoviedb.org/3',
   params:{
      'api_key': API_KEY,
   }
})

const lazyLoadingMovieContainer = (entries) => {
   entries.forEach((element)=> {
      if (element.isIntersecting){
         const url = element.target.getAttribute('data-img')
         element.target.setAttribute('src',url);
      }
      });
}

const observer = new IntersectionObserver(lazyLoadingMovieContainer);

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
      let movieName = hash.split('=')[1];
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

         const btnLoadMore = createBtnLoadMore();
         btnLoadMore.addEventListener('click',() => getPaginatedTrendingMovies(data));
      }
   }catch (error){
      console.error(error);
   }
};

const getPaginatedTrendingMovies = async (lastData) => {
   try{
      const {data, status} = await fetchApi.get('/trending/movie/day',{
         params:{
            'page': lastData.page+1,
         }
      });
      if(status === 200){
         elementHTMLCreator({
            data: data,
            baseClass: 'movie-container',
            parent: genericSection,
            clear: false,
         })

         const btnLoadMore = createBtnLoadMore();
         btnLoadMore.addEventListener('click',() => getPaginatedTrendingMovies(data));
      }
   } catch (error){
      console.error(error);
   }
}

const createBtnLoadMore = () => {
   const lastBtn = genericSection.querySelector('button');
   if(lastBtn) genericSection.removeChild(lastBtn);   
   const btnLoadMore = document.createElement('button');
   btnLoadMore.innerHTML= 'Cargar mas';
   genericSection.appendChild(btnLoadMore);
   return btnLoadMore;
}


