import Recipe from "../models/Recipe";
import * as index from "../index";
import * as Delete from "../models/Delete";
import * as addRecipeView from "./addRecipeView";

export const getInput = () => $(".search__field").val();

export const clearInput = () => {
  $(".search__field").val("");
};

export const insertDomElements = () => {
  $(".results")[0].style.display = "block";
  $(".recipe")[0].textContent = "";
  $(".shopping")[0].style.display = "block";
};

export const clearResults = () => {
  $(".results__list").text("");
  $(".results__pages").text("");
};

export const removeHighlightSelected = () => {
  const resultsArr = Array.from(document.querySelectorAll(".results__link"));
  resultsArr.forEach((el) => {
    el.classList.remove("results__link--active");
  });
};

export const highlightSelected = (id) => {
  // add heighlight to search recipe
  document
    .querySelector(`.results__link[href*="${id}"]`)
    .classList.add("results__link--active");
};

/*
// `Pasta with tomoto and spanish`
acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomoto']
acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta' 'with', 'tomoto']
acc: 18 / acc + cur.length = 25 / newTitle = ['Pasta', 'with', 'tomoto']
*/

export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];

  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);

    // return the result
    return `${newTitle.join(" ")} ...`;
  }
  return title;
};

let getID;
const renderRecipe = (recipe) => {
  getID = (uri) => uri.split("#")[1];
  const markup = `
      <li class="li">
          <a class="results__link" href="#${
            recipe.recipe.uri ? getID(recipe.recipe.uri) : recipe.recipe._id
          }">
              <figure class="results__fig">
                  <img src="${
                    recipe.recipe._id
                      ? `${process.env.API_URL}/${recipe.recipe.image}`
                      : recipe.recipe.image
                  }" alt="${recipe.recipe.label}">
              </figure>
              <div class="results__data">
                  <h4 class="results__name">${limitRecipeTitle(
                    recipe.recipe.label
                  )}</h4>
                  <p class="results__author">${recipe.recipe.source}</p>
                  ${
                    recipe.recipe.favRecipe
                      ? `
                    <div class="buttons">
                      <input class="edit" type="button" value="Edit">
                      <input class="delete" type="button" value="Delete">                  
                    </div>
                  `
                      : ""
                  }                   
              </div>
          </a>
      </li>
  `;

  $(".results__list")[0].insertAdjacentHTML("beforeend", markup);
};

export const renderGoBack = () => {
  const html = `
    <input type="button" value="Go back" title="GO Back" class="btn go__back-recipe">
  `;

  if ($(".results__list")[0].textContent != "") {
    $(".recipe")[0].textContent = "";
    $(".recipe")[0].insertAdjacentHTML("afterbegin", html);

    // Show go back button and call
    $(".go__back-recipe").show();
    goBack();
  }
};

// type: 'prec' or 'next'
const createButton = (page, type) => `

  <button class="btn-inline results__btn--${type}" data-goto=${
  type === "prev" ? page - 1 : page + 1
}>
   <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${
        type === "prev" ? "left" : "right"
      }"></use>
    </svg>
  </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage); // Math.ceil use to round up results ex... if there is 4.1 or 4.8 it round it to 5;
  let button;

  if (page === 1 && pages > 1) {
    // Only button to go to NEXT PAGE
    button = createButton(page, "next");
  } else if (page < pages) {
    // button to go to both page (NEXT PAGE & PREVIOUS PAGE)
    button = `
       ${createButton(page, "prev")}
       ${createButton(page, "next")}
    `;
  } else if (page === pages && pages > 1) {
    // Only button to go to  PREVIOUS PAGE
    button = createButton(page, "prev");
  }

  $(".results__pages")[0].insertAdjacentHTML("afterbegin", button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // render results of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  // Render go back button
  renderGoBack();

  // Clear URL history
  history.pushState({}, null, process.env.APP_URL);

  if (recipes.length > 10) {
    // render pagination button
    renderButtons(page, recipes.length, resPerPage);
  }

  // show buttons
  showButtons();

  // Call edit recipe function
  editRecipe();

  // Call delete recipe function
  deleteRecipeFromDb();
};

// Go back function
const goBack = () => {
  $(".go__back-recipe").click((e) => {
    e.preventDefault();

    $(".results__list")[0].textContent = "";
    $(".results__pages")[0].textContent = "";
    $(".recipe")[0].textContent = "";
  });
};

// show edit and delete recipe buttons
const showButtons = () => {
  $(document).ready(() => {
    const lists = document.querySelectorAll(".li");
    const buttons = document.querySelectorAll(".buttons");

    $(lists).each((l, el) => {
      $(buttons).each((b, ed) => {
        $(el).hover(
          function () {
            if (l === b) {
              $(ed).show();
            }
          },
          function () {
            $(ed).hide();
          }
        );
      });
    });
  });
};

const editRecipe = async () => {
  const edits = document.querySelectorAll(".edit");
  $(document).ready(() => {
    $(edits).each((i, el) => {
      $(el).click((e) => {
        e.preventDefault();

        // Edit mode is on
        const edit = true;

        // Get recipe id
        const id = getID(e.target.parentNode.parentNode.parentNode.href);

        // Get recipe by id
        const recipe = new Recipe(id);

        recipe
          .getRecipeFromDb()
          .then((recipeData) => {
            // Clear UI
            $(".recipe").text("");

            // Call add recipe function with edit is true and recipe
            addRecipeView.recipeForm(edit, recipeData);
          })
          .catch((err) => {
            alert(err);
          });
      });
    });
  });
};

const deleteRecipeFromDb = () => {
  const deletes = document.querySelectorAll(".delete");
  $(document).ready(() => {
    $(deletes).each((i, el) => {
      $(el).click((e) => {
        e.preventDefault();

        // Get recipe id
        const id = getID(e.target.parentNode.parentNode.parentNode.href);

        // Call delete recipe function
        Delete.deleteRecipe(id);

        // Update UI
        index.controlSearch();
      });
    });
  });
};
