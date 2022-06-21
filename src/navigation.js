searchFormBtn.addEventListener('click',() => {
   location.hash = `search=${searchFormInput.value}`;
});

trendingBtn.addEventListener('click',() => location.hash = 'trends=');

arrowBtn.addEventListener('click',() => {
   history.back();
});

const navigator = () => {
   (location.hash.startsWith('#trends='))
   ? trendsPage()
   : (location.hash.startsWith('#search='))
     ? searchPage()
     : (location.hash.startsWith('#movie='))
       ? movieDetailsPage()
       : (location.hash.startsWith('#category='))
         ? categoryPage()
         : homePage();
   window.scrollTo( 0, 0 );
}

window.addEventListener('DOMContentLoaded', navigator);

window.addEventListener('hashchange', navigator);

const homePage = () => {
   activateSections({
      headerTitleActive: 1,
      searchFormActive: 1,
      trendingPreviewSectionActive: 1,
      categoriesPreviewSectionActive: 1,
   });
   getTrendingMoviesPreview();
   getCategoriesPreviewList();
}

const trendsPage = () => {
   activateSections({
      headerTitleActive: 1,
      arrowBtnActive: 1,
      headerCategoryTitleActive:1,
      genericSectionActive: 1,
   });
   trendingMovies(location.hash);
}

const searchPage = () => {
   activateSections({
      headerTitleActive: 1,
      arrowBtnActive: 1,
      searchFormActive: 1,
      genericSectionActive: 1,
   });
   searchMovie(location.hash);
}


const movieDetailsPage = () => {
   activateSections({
      headerTitleActive: 1,
      headerSectionLong: 1,
      headerSectionBackground: 1,
      arrowBtnActive: 1,
      arrowBtnWhite: 1,
      movieDetailSectionActive: 1,
   });

   getMovieById(location.hash);
}

const categoryPage = () => {
   activateSections({
      headerTitleActive: 1,
      arrowBtnActive: 1,
      headerTitleActive: 1,
      headerCategoryTitleActive: 1,
      genericSectionActive: 1,
   });
   getMoviesByCategory(location.hash);
}

const activateSections = ({
   headerSectionLong = 0,
   headerSectionBackground = 0,
   arrowBtnActive = 0,
   arrowBtnWhite = 0,
   headerTitleActive = 0,
   headerCategoryTitleActive = 0,
   searchFormActive = 0,
   trendingPreviewSectionActive = 0,
   categoriesPreviewSectionActive = 0,
   genericSectionActive = 0,
   movieDetailSectionActive = 0,
}) => {
   
   (headerSectionLong === 1)
      ?headerSection.classList.add('header-container--long')
      :headerSection.classList.remove('header-container--long');

   (headerSectionBackground === 1)
      ?null
      :headerSection.style.background = '';

   (arrowBtnActive === 1)
      ?arrowBtn.classList.remove('inactive')
      :arrowBtn.classList.add('inactive');

   (arrowBtnWhite === 1)
      ?arrowBtn.classList.add('header-arrow--white')
      :arrowBtn.classList.remove('header-arrow--white');

   (headerTitleActive === 1)
      ?headerTitle.classList.remove('inactive')
      :headerTitle.classList.add('inactive');

   (headerCategoryTitleActive === 1)
      ?headerCategoryTitle.classList.remove('inactive')
      :headerCategoryTitle.classList.add('inactive');

   (searchFormActive === 1)
      ?searchForm.classList.remove('inactive')
      :searchForm.classList.add('inactive');

   (trendingPreviewSectionActive === 1)
      ?trendingPreviewSection.classList.remove('inactive')
      :trendingPreviewSection.classList.add('inactive');

   (categoriesPreviewSectionActive === 1)
      ?categoriesPreviewSection.classList.remove('inactive')
      :categoriesPreviewSection.classList.add('inactive');

   (genericSectionActive === 1)
      ?genericSection.classList.remove('inactive')
      :genericSection.classList.add('inactive');
      
   (movieDetailSectionActive === 1)
      ?movieDetailSection.classList.remove('inactive')
      :movieDetailSection.classList.add('inactive');
}