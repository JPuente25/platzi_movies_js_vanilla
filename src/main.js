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
      const [trash, categoryDetails, pageNumber] = hash.split('=');
      let [categoryId, categoryName] = categoryDetails.split('-');
      categoryName = categoryName.split('?')[0];
      headerCategoryTitle.innerHTML = categoryName.replace('%20',' ');
      const {data,status} = await fetchApi.get('/discover/movie',{
         params: {
            'with_genres': categoryId,
            'page': pageNumber,             
         },
      })
      if(status === 200){
         elementHTMLCreator({
            data:data,
            baseClass: 'movie-container',
            mainClass: 'movie-container-category',
            parent: genericSection,
         });
         getPagination(data);
      }
   } catch (error){
      console.error(error);
   }
};

const searchMovie = async (hash) => {
   try{
      console.log(hash)
      let [trash,movieName,pageNumber] = hash.split('=');
      movieName = movieName.split('?page')[0];
      const {data,status} = await fetchApi.get('/search/movie',{
         params:{
            'query': movieName,
            'page': pageNumber,
         }
      })
      if(status === 200){
         elementHTMLCreator({
            data: data,
            baseClass: 'movie-container',
            parent: genericSection,
         })
         getPagination(data);
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

const getPagination = (data) => {
   console.log(data)

   pagination.innerHTML = '';
   const minPages = 10;

   for(let i = 1; i <= Math.min(minPages,data.total_pages); i++){
      const paginationButton = createButton(i);

      //Ultima iteracion
      if(i == minPages && i <= data.total_pages-1){
         createButton('...')
         const paginationButtonLast = createButton(data.total_pages);

         paginationButtonLast.addEventListener('click', () => {
            paginationPageJump(paginationButtonLast)
         });
      }

      paginationButton.addEventListener('click', () => {
         paginationPageJump(paginationButton)
      });

      
      


   }



}

const paginationPageJump = (button) => {

   if(location.hash.includes('?page=')){
      const splitHash = location.hash.split('?page=');
      splitHash[1] = button.innerHTML;
      location.hash = splitHash.join('?page=');
   }
}

const createButton = (number) => {
   const paginationButton = document.createElement('button');
   paginationButton.classList.add('pagination-button');
   paginationButton.innerHTML = number;
   pagination.appendChild(paginationButton);
   return paginationButton;
}