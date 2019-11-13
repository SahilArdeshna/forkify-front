// Global app controller
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Like from "./models/Like";
import * as logout from "./models/Logout";
import * as UserProfile from "./models/UserProfile";
import * as loginView from "./views/loginView";
import * as searchView from "./views/searchView";
import * as homeView from './views/homeView';
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likeView from "./views/likeView";
import * as addRecipeView from "./views/addRecipeView";
import * as userProfileView from "./views/userProfileView";
import { renderLoader, clearLoader } from "./views/base";

// Check for user token
export const checkUserToken = async () => {
  const token = window.localStorage.getItem('forkifyToken');  

  if (token) {        

    // Show main page    
    homeView.mainPage();
    
    $(document).ready(async () => {      

      // Display container
      showContainer();
    });

  } else {    

    // Display login page
    await loginView.login();
  }
};

checkUserToken();

// Global variable
let state = {};
let favRecipe;

async function showContainer () {  

  // Update user name

  // Get user data from database
  const result = await UserProfile.getUserData();

  // Parse user data
  const data = JSON.parse(result);

  await homeView.updateUserName(data.user);

  // On page load or new sign in do this
  if (!state.likes) {
    state.likes = new Like();

    // Get liked recipes from database and store them in likes
    await state.likes.getLikedRecipesFromDB();
    
    // Toggle likes menu button
    likeView.toggleLikesMenu(await state.likes.getNumLikes());

    //render the existing likes
    state.likes.likes.forEach(like => likeView.renderLike(like));

  } else {
    //render the existing likes
    state.likes.likes.forEach(like => likeView.renderLike(like));
  }

  /*
  * SEARCH CONTROLLER
  */   

  $('.search').on("submit", e => {
    e.preventDefault();

    favRecipe = false;
    controlSearch();
  });

  $('.results__pages').on("click", e => {
    const btn = e.target.closest(".btn-inline");

    if (btn) {
      const goToPage = parseInt(btn.dataset.goto, 10);
      searchView.clearResults();
      searchView.renderResults(state.search.result, goToPage);
    }
  });

  /*
  * RECIPE CONTROLLER
  */

  const controlRecipe = async () => {
    // Get id from url
    const id = window.location.hash.replace("#", "");
    
    if (id) {
      // Prepare UI changes
      recipeView.clearRecipe();
      renderLoader($('.recipe'));

      // remove heghlight selected
      searchView.removeHighlightSelected();

      if (state.search) {
        state.search.result.forEach(el => {
          if (el.recipe.uri) {
            const recipeId = el.recipe.uri.split('#')[1];
            if (recipeId === id) {  
              // Highlight Selected search item
              searchView.highlightSelected(id);
            }
          } else {
            if (el.recipe._id == id) {
              // Highlight Selected search item
              searchView.highlightSelected(id);
            }
          }
        });
      }

      // Create new recipe object
      state.recipe = new Recipe(id);

      let result;
      try {      
        if (!favRecipe) {
          // Get recipe data from WEB
          result = await state.recipe.getRecipe();
        } else {
          // Get recipe from DATABASE
          result = await state.recipe.getRecipeFromDb();
        }
        console.log(result, 1);
        if (result) {
          // parse ingredients
          state.recipe.parseIngredients();
          
          console.log(result, 2);

          if (state.recipe.time < 5) {
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
          }
  
          // Render recipe  
          clearLoader();
          console.log(result, 3);
          recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        }
        console.log(result, 4);

      } catch (err) {
        alert("Error processing recipe!");
      }
    }
  };

  // window.addEventListener('hashchange', controlRecipe);
  // window.addEventListener('load', controlRecipe);
  

  $(document).ready(() => {
    ["hashchange", 'load'].forEach(event =>
      window.addEventListener(event, e => {
        const id = window.location.hash.replace("#", "").split('_')[0];
        if (id == "recipe") {
          favRecipe = false; 
        } else {
          favRecipe = true;
        }
        
        controlRecipe();
      })
    );
  });


  /*
  * LIST CONTROLLER
  */

  const controlList = () => {
    // create new list  if there is not list
    if (!state.list) state.list = new List();

    // add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
      const item = state.list.addItem(el.count, el.unit, el.ingredient);
      listView.renderItem(item);
    });
  };

  // Handle delete and Update list item events
  $('.shopping__list').on("click", e => {
    const id = e.target.closest(".shopping__item").dataset.itemid;

    // Handle delete button
    if (e.target.matches(".shopping__delete, .shopping__delete *")) {
      // Delete from state
      state.list.deletItem(id);

      // Delete from UI
      listView.deleteItem(id);

      // Handle the count update
    } else if (e.target.matches(".shopping__count-value")) {
      const val = parseFloat(e.target.value);
      state.list.updateCount(id, val);
    }
  });

  /*
  * LIKES CONTROLLER
  */

  const controlLike = async () => {    
    if (state.recipe && favRecipe == false) {
      const currentID = state.recipe.id;

      // User has NOT yet like current recipe
      if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = await state.likes.addLike(
          state.recipe
        );
        
        // Get liked recipes from database and store them in likes
        await state.likes.getLikedRecipesFromDB();

        // Toggle the like button
        likeView.toggleLikeBtn(true);

        // Add like to the UI list
        likeView.renderLike(newLike);
      } else {
        // Remove liked recipe from database
        await state.likes.deleteLikedRecipe(currentID);
        
        // Remove like from the list
        state.likes.deleteLike(currentID);

        // Get remaining liked recipe from database
        await state.likes.getLikedRecipesFromDB();

        // Toggle the like button
        likeView.toggleLikeBtn(false);

        // Remove like from the UI list
        likeView.deleteLike(currentID);
      }
    }

    const likedRecipeLength = await state.likes.getNumLikes();
    // Toggle like menu button
    likeView.toggleLikesMenu(likedRecipeLength);
  };
  
  // Call control like function
  controlLike();    

  // Handling recipe button clicks
  $('.recipe').on("click", e => {
    if (e.target.matches(".btn-decrease, .btn-decrease *")) {
      // Decrease button is clicked
      if (state.recipe.servings > 1) {
        state.recipe.updateServings("dec");
        recipeView.updateServingIngredient(state.recipe);
      }
    } else if (e.target.matches(".btn-increase, .btn-increase *")) {
      // Increase button is clicked
      state.recipe.updateServings("inc");
      recipeView.updateServingIngredient(state.recipe);
    } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
      // Add ingredients to the shopping list
      controlList();
    } else if (e.target.matches(".recipe__love, .recipe__love *")) {
      // Add recipe to favourite list
      controlLike();
    }
  });  

  /*
    Profile
  */

  $('.user__detail').on('click', e => {
    e.preventDefault();

    // Call user info function
    userProfile();
  });

  /* 
    Add Recipe
  */

  $('.add__recipe').on("click", e => {
    e.preventDefault();
    controlAddRecipe();
  });

  /*
    Favorite Recipe
  */

  const controlFavoriteRecipes = () => {
    // (1) searchView
    favRecipe = true;

    // search for favorite recipes from database
    controlSearch();
  };

  $('.favorite__recipes').on("click", e => {
    e.preventDefault();
    controlFavoriteRecipes();
  });

  /*
    Logout User
  */

  $(document).ready(() => {
    $('.logout').click(async (e) => {
      e.preventDefault();

      const newUrl = 'https://forkify-front.herokuapp.com';
      history.pushState({}, null, newUrl);
          
      // Logout user
      await logout.logout();

      state = {};
      favRecipe = false;
    });
  });
};

// RECIPE SEARCH CONTROL FUNCTION
export const controlSearch = async () => {
  // 1) Get query from view
  const query = searchView.getInput(); // TODO

  if (query != "") {
    favRecipe = false;
  }
  
  if (query || favRecipe) {  
    // 2) New search object and add to state
    state.search = new Search(query);

    // 3) prepare UI for results

    // clear loader
    clearLoader();

    // clear input field
    searchView.clearInput();

    // check for DOM elements
    if (
      $('.results')[0].style.display == "none" &&
      $('.recipe')[0].style.display !== "none" &&
      $('.shopping')[0].style.display == "none"
    ) {
      searchView.insertDomElements();
    }

    // clear results lists
    searchView.clearResults();

    // spinner Loader
    renderLoader($('.results'));

    try {
      let res;
      if (!favRecipe) {
        // 4) Search for recipes from WEB
        res = await state.search.getResults();
      } else {
        // 4) Search for recipes on DATABASE
        res = await state.search.getResultsFromDb();
      }

      // 5) Render results on UI
      clearLoader();
      
      if (res) {
        searchView.renderResults(state.search.result);
      }

    } catch (error) {
      alert("Something went wrong with search");
      clearLoader();
    }
  }
};

//  USER DATA VIEW FUCNTION
export const userProfile = async () => {

  // Get user data from database
  const result = await UserProfile.getUserData();

  // Parse user data
  const data = JSON.parse(result);

  // clear UI
  userProfileView.clearUI();

  // Display user data
  userProfileView.userData(data.user);
};

// ADD RECIPEVIEW FUNCTION
export const controlAddRecipe = () => {

  // Clear UI
  addRecipeView.clearUI();

  // Display add recipe form to UI
  addRecipeView.recipeForm();
};

$(window).on('load', (e) => {
  history.pushState({}, null, 'https://forkify-front.herokuapp.com');
});