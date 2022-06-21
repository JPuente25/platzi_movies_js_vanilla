const createCategories = (data,parent) => {
   console.log(data);
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
      elementImg.setAttribute(
         'data-img',
         (element.poster_path) 
         ? `https://image.tmdb.org/t/p/w300${element.poster_path}`
         : 'https://cdn3.vectorstock.com/i/1000x1000/50/07/http-404-not-found-error-message-hypertext-vector-20025007.jpg'
         );

      observer.observe(elementImg);

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
            mainClass: 'movie-container--related',
            parent: relatedMoviesContainer,
         })
      }
   } catch(error){
      console.error(error);
   };
};



