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
         location.hash = `category=${genre.id}-${genre.name}?page=1`;
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

   //ITERAR Y CREAR EL HTML
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

      //ACTIVAR INTERSECTION OBSERVER
      observer.observe(elementImg);

      elementContainer.appendChild(elementImg);
      parent.appendChild(elementContainer);
     

      //BOTON DE LIKE Y FUNCIONALIDAD
      const movieBtn = document.createElement('button');
      movieBtn.classList.add('movie-btn');
      movieBtn.classList.add(`id${element.id}`);
      elementContainer.appendChild(movieBtn);
      if(localStorage.getItem(element.original_title)){
         movieBtn.classList.add('movie-btn--like');
      }

      movieBtn.addEventListener('click', () => {
         const likeBtn = document.querySelectorAll(`.id${element.id}`);
         likeBtn.forEach((btn) => {
            btn.classList.toggle('movie-btn--like');
         })
         addMovieLocalStorage(element);
         getFavoritesMovies();
      });


      //REDIRECCIONAR A MOVIEDETAILS CUANDO SE HACE CLICK EN IMG
      elementImg.addEventListener('click', () => {
         location.hash = `movie=${element.id}`;
      });
   })
};

//AGREGAR OBJETOS A LOCALSTORAGE
function addMovieLocalStorage (movie) {
   let item = localStorage.getItem(movie.original_title);
   item
   ? item = JSON.parse(item)
   : item = {};
   item.id
   ?  localStorage.removeItem(movie.original_title)
   :  localStorage.setItem(movie.original_title,JSON.stringify(movie));
}


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

const createButtonMore = (text) => {
   const buttonMore = document.createElement('button');
   buttonMore.classList.add('pagination-button','pagination-button--more');
   buttonMore.innerHTML = text;
   pagination.appendChild(buttonMore);
   return buttonMore;
}

const createPaginationButtons = (
   firstPage,
   lastPage,
   totalPages,
   actualPage
   ) => {
   for(let i = firstPage; i <= Math.min(lastPage,totalPages); i++){
      const paginationButton = createButton(i,actualPage);
      paginationButton.addEventListener('click', () => {
         paginationPageJump(paginationButton.innerHTML)
      });
   }
} 

const paginationPageJump = (pagina) => {
   if(location.hash.includes('?page=')){
      const splitHash = location.hash.split('?page=');
      splitHash[1] = pagina;
      location.hash = splitHash.join('?page=');
   }
}

const createButton = (number,actualPage) => {
   const paginationButton = document.createElement('button');
   paginationButton.classList.add('pagination-button');
   if(number == actualPage){
      paginationButton.classList.add('selected-button');
   }
   paginationButton.innerHTML = number;
   pagination.appendChild(paginationButton);
   return paginationButton;
}