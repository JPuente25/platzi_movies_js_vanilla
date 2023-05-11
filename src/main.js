const API_KEY = "88e1b4af6e39907f7712618a9cc00e88";
const URL_TMDB = "https://api.themoviedb.org/3";
const observer = new IntersectionObserver(lazyLoadingMovieContainer);

const fetchApi = axios.create({
   baseURL: "https://api.themoviedb.org/3",
   params: {
      api_key: API_KEY,
      language: 'en',
   },
}); //MIGRADO

function lazyLoadingMovieContainer (entries) {
   entries.forEach((element) => {
      if (element.isIntersecting) {
         const url = element.target.getAttribute("data-img");
         element.target.setAttribute("src", url);
      }
   });
}; //PENDIENTE

const getCategoriesPreviewList = async () => {
   try {
      const { data, status } = await fetchApi.get("/genre/movie/list");
      if (status === 200) {
         createCategories(data, categoriesPreviewList);
      }
   } catch (error) {
      console.error(error);
   }
}; //MIGRADO

const getTrendingMoviesPreview = async () => {
   try {
      const { data, status } = await fetchApi.get("/trending/movie/day");
      if (status === 200) {
         elementHTMLCreator({
            data: data,
            baseClass: "movie-container",
            mainClass: "movie-container-preview",
            parent: trendingMoviesPreviewList,
         });
      }
   } catch (error) {
      console.error(error);
   }
}; //MIGRADO

const getMoviesByCategory = async (hash) => {
   try {
      const [trash, categoryDetails, pageNumber] = hash.split("=");
      let [categoryId, categoryName] = categoryDetails.split("-");
      categoryName = categoryName.split("?")[0];
      headerCategoryTitle.innerHTML = categoryName.replace("%20", " ");
      const { data, status } = await fetchApi.get("/discover/movie", {
         params: {
            with_genres: categoryId,
            page: pageNumber,
         },
      });
      if (status === 200) {
         elementHTMLCreator({
            data: data,
            baseClass: "movie-container",
            mainClass: "movie-container-category",
            parent: genericSection,
         });
         getPagination(data);
      }
   } catch (error) {
      console.error(error);
   }
}; //MIGRADO

const searchMovie = async (hash) => {
   try {
      console.log(hash);
      let [trash, movieName, pageNumber] = hash.split("=");
      movieName = movieName.split("?page")[0];
      const { data, status } = await fetchApi.get("/search/movie", {
         params: {
            query: movieName,
            page: pageNumber,
         },
      });
      if (status === 200) {
         elementHTMLCreator({
            data: data,
            baseClass: "movie-container",
            parent: genericSection,
         });
         getPagination(data);
      }
   } catch (error) {
      console.error(error);
   }
}; //MIGRADO

const trendingMovies = async () => {
   headerCategoryTitle.innerHTML = "Trendings";
   try {
      const { data, status } = await fetchApi.get("/trending/movie/day");
      if (status === 200) {
         elementHTMLCreator({
            data: data,
            baseClass: "movie-container",
            parent: genericSection,
         });
      }
   } catch (error) {
      console.error(error);
   }
}; //MIGRADO

const getPagination = (data) => {
   const totalPages = data.total_pages;
   const actualPage = data.page;
   pagination.innerHTML = "";
   const minPage = 10;
   const firstPage = actualPage - minPage / 2;
   const lastPage = data.page + minPage / 2 - 1;

   if (actualPage !== 1) {
      const buttonPrevious = createButtonMore("Anterior");
      buttonPrevious.addEventListener("click", () => paginationPageJump(actualPage - 1));
   }

   if (actualPage > minPage / 2) {
      createPaginationButtons(firstPage, lastPage, totalPages, actualPage);
   } else {
      createPaginationButtons(1, minPage, totalPages, actualPage);
   }

   if (lastPage < totalPages - 1) {
      const buttonNext = createButtonMore("Siguiente");
      buttonNext.addEventListener("click", () => paginationPageJump(actualPage + 1));
   }
}; //MIGRADO

const getFavoritesMovies = () => {
   const data = {results: []};
   for (let i = 0 ; localStorage.key(i) !== null ; i++){
      const localStorageGetItem = JSON.parse(localStorage.getItem(localStorage.key(i)));
      data.results.push(localStorageGetItem);
   }
   elementHTMLCreator({
      data: data,
      baseClass: 'movie-container',
      parent: likesMovieList,
   })
} //PENDIENTE
