import * as index from '../index';
import * as AddRecipe from '../models/AddRecipe';
import * as EditRecipe from '../models/EditRecipe';
import * as likeView from './likeView';
import * as searchView from './searchView';

// Clear UI
export const clearUI = () => {
    // Clear history
    history.pushState({}, null, 'https://forkify-front.herokuapp.com');

    // Clear UI
    $('.results')[0].style.display = 'none';
    $('.recipe')[0].textContent = '';
    $('.shopping')[0].style.display = 'none';
};

// display recipe form to UI
export const recipeForm = (edit, recipe) => {
    const html = `
        <div class="recipe__form">
            <div id="errorMsg" class="errorMsg"></div>
            <form enctype="multipart/form-data">
                <div class="form__title">
                    <h2>${edit ? `Edit Recipe Details` : `Add Recipe Details`}</h2>
                </div>  
                <div class="form-group">
                    <label for="recipe name">Recipe Name</label>
                    <input type="text" class="form-control label" name="label" id="recipe__name" placeholder="recipe name" value="${edit ? recipe.label : ''}" required>
                </div>
                <div class="form-group">
                    <label for="iamge">Image</label>
                    <input type="file" class="form-control image" name="image" id="image__url" accept="image/*" ${!edit ? `required` : ''}>
                </div>
                <div class="form-group">
                    <label for="ingredients">Ingredients</label>
                    <textarea type="textarea" rows="3" class="form-control ingredientLines" name="ingredientLines" id="ingredients" placeholder="ex: 1 tbsp oil, 1/2 tbsp salt" required>${edit ? recipe.ingredientLines.toString() : ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="author">Author</label>
                    <input type="text" class="form-control source" name="source" id="author" placeholder="creator name" name" value="${edit ? recipe.source : ''}" required>
                </div>
                <div class="form-group">
                    <label for="total time">Total Time</label>
                    <input type="number" min="1" class="form-control totalTime" name="totalTime" id="total__time" placeholder="only number" name" value="${edit ? recipe.totalTime : ''}" required>
                </div>
                <div class="form-group">
                    <label for="servings">Servings</label>
                    <input type="number" min="1" class="form-control yield" name="yield" id="servings" placeholder="recipe serve for total number of persons" name" value="${edit ? recipe.yield : ''}" required>
                </div>
                <div class="form__button">
                    <input type="button" value=" ${edit ? 'Update recipe' : 'Add recipe'}" title="${edit ? 'Update Recipe' : 'Add Recipe'}" class="btn ${edit ? 'edit__recipe-data' : 'add__recipe-data'}">
                    <br><br>
                    <input type="button" value="go back" title="Go Back" class="btn go__back">
                </div>
            </form>
        </div>
    `;

    $('.recipe')[0].style.gridColumn = '2';
    $('.recipe')[0].insertAdjacentHTML('afterbegin', html);

    $(document).ready(() => {
        $('.add__recipe-data').click((e) => {
            e.preventDefault();

            // Call add recipe function
            addRecipeIntoDb();
        });

        $('.edit__recipe-data').click((e) => {
            e.preventDefault();
    
            // Call add recipe function
            editRecipeIntoDb(recipe._id);
        });

        // call goback function
        goback();
    });
};

// GO back function
export const goback = () => {
    $('.go__back').click(e => {
        e.preventDefault();

        // Chang url history
        const newUrl = 'https://forkify-front.herokuapp.com';
        history.pushState({}, null, newUrl);

        // Check for hide elements
        if (
            $('.results')[0].style.display == "none" &&
            $('.shopping')[0].style.display == "none"
        ) {
            // Show DOM elements
            $('.results').show();            
            $('.shopping').show();
        }

        // Check for search list have 0 result
        if ($('.results__list')[0].children.length === 0) {
            // Clear recipe UI
            $('.recipe')[0].textContent = '';

        } else {
            // Update searchView UI
            index.controlSearch();
    
            // Go back 1 step
            searchView.renderGoBack();  
        }                
    });
};

// add recipe into database
const addRecipeIntoDb = async () => {    
    try {
        // Call addRecipe function
        await AddRecipe.addRecipe();

        // Call add recipeview function
        index.controlAddRecipe();
    } catch (err) {
        // not need to preview
    }
};

// edit recipe into database
const editRecipeIntoDb = async (recipeId) => {
    try {
        // Call editRecipe function
        await EditRecipe.editRecipe(recipeId);
        
        // Show searchView UI
        index.controlSearch();

    } catch (err) {
        // not need to preview
    }
};
