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

const getMoviesByCategory = async (hash,lastPage = 0) => {
   try{
      const [categoryId, categoryName] = hash.split('=')[1].split('-');
      headerCategoryTitle.innerHTML = categoryName.replace('%20',' ');
      const {data,status} = await fetchApi.get('/discover/movie',{
         params: {
            'with_genres': categoryId,    
            'page': lastPage + 1,        
         },
      })
      if(status === 200){
         elementHTMLCreator({
            data:data,
            baseClass: 'movie-container',
            mainClass: 'movie-container-category',
            parent: genericSection,
            clear: 0,
         });
         document.addEventListener('scroll',scrollListener);
         function scrollListener (e) {
            const scrollHeight = document.documentElement.scrollHeight;
            const windowHeight = document.documentElement.clientHeight;
            const actualScroll = document.documentElement.scrollTop;
            if(scrollHeight - windowHeight - 100 <= actualScroll){
               console.log('entrando a category');
               e.target.removeEventListener(e.type,scrollListener);
               getMoviesByCategory(hash,data.page);
            }
         }
      }
   } catch (error){
      console.error(error);
   }
};

const searchMovie = async (hash,lastPage = 0) => {
   //e.target.removeEventListener(e.type,scrollListener);
   try{
      let movieName = hash.split('=')[1];
      const {data,status} = await fetchApi.get('/search/movie',{
         params:{
            'query': movieName,
            'page': lastPage + 1
         }
      })
      if(status === 200){
         elementHTMLCreator({
            data: data,
            baseClass: 'movie-container',
            parent: genericSection,
            clear: 0,
         })
         document.addEventListener('scroll',scrollListener);
         function scrollListener (e) {
            const scrollHeight = document.documentElement.scrollHeight;
            const windowHeight = document.documentElement.clientHeight;
            const actualScroll = document.documentElement.scrollTop;
            if(scrollHeight - windowHeight - 100 <= actualScroll){
               e.target.removeEventListener(e.type,scrollListener);
               console.log('entrando a search');
               console.log(e.target);
               searchMovie(hash,data.page);
            }
         }
      }
   }catch (error){
      console.error(error);
   }
   
};

const trendingMovies = async (lastPage = 0) => {
   headerCategoryTitle.innerHTML = 'Tendencias';
   try{
      const {data, status} = await fetchApi.get('/trending/movie/day',{
         params:{
            'page': lastPage + 1,
         }
      });
      if(status === 200){
         elementHTMLCreator({
            data: data,
            baseClass: 'movie-container',
            parent: genericSection,
            clear: 0,
         })
         document.addEventListener('scroll',scrollListener);
         function scrollListener (e) {
            const scrollHeight = document.documentElement.scrollHeight;
            const windowHeight = document.documentElement.clientHeight;
            const actualScroll = document.documentElement.scrollTop;
            if(scrollHeight - windowHeight - 100 <= actualScroll){
               console.log('entrando a trend');
               e.target.removeEventListener(e.type,scrollListener);
               trendingMovies(data.page);
            }
         }
      }
   }catch (error){
      console.error(error);
   }
};


