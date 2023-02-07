export default class Likes {
  constructor() {
    this.likes = [];
  }

  async addLike(recipe) {
    // Add liked recipe into database
    const result = await this.addRecipeIntoDb(recipe);
    const recipeData = JSON.parse(result);

    const like = {
      id: recipeData.recipe.recipeId,
      recipeId: recipeData.recipe._id,
      title: recipeData.recipe.label,
      author: recipeData.recipe.source,
      image: recipeData.recipe.image,
      ingredients: recipeData.recipe.ingredientLines,
      time: recipeData.recipe.totalTime,
      servings: recipeData.recipe.yield,
    };

    this.likes.push(like);

    // Perist data in local storage
    // this.persistData();

    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex((el) => el.id === id);
    this.likes.splice(index, 1);

    // Perist data in local storage
    // this.persistData();
  }

  isLiked(id) {
    return this.likes.findIndex((el) => el.id === id) !== -1;
  }

  async getNumLikes() {
    return this.likes.length;
  }

  persistData() {
    localStorage.setItem("likes", JSON.stringify(this.likes));
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem("likes"));

    // restoring likes from local storage
    if (storage) this.likes = storage;
  }

  addRecipeIntoDb(recipe) {
    const recipeForm = new FormData();
    recipeForm.append("label", recipe.title);
    recipeForm.append("image", recipe.img);
    recipeForm.append("ingredientLines", JSON.stringify(recipe.ingredients));
    recipeForm.append("source", recipe.author);
    recipeForm.append("totalTime", recipe.time);
    recipeForm.append("yield", recipe.servings);
    recipeForm.append("url", recipe.url);
    recipeForm.append("recipeId", recipe.id);

    return $.ajax({
      type: "POST",
      url: `${process.env.API_URL}/addLikedRecipe`,
      data: recipeForm,
      processData: false,
      contentType: false,
      headers: {
        Authorization: window.localStorage.getItem("forkifyToken"),
      },
    })
      .done((result) => {})
      .fail((err) => {
        const error = JSON.parse(err.responseText);
        alert(error.error);
      });
  }

  async getLikedRecipesFromDB() {
    return $.ajax({
      type: "GET",
      url: `${process.env.API_URL}/getLikedRecipes`,
      headers: {
        Authorization: window.localStorage.getItem("forkifyToken"),
      },
    })
      .done((result) => {
        const data = JSON.parse(result);

        const recipes = [];
        data.recipes.forEach((el) => {
          const recipeData = {
            id: el.recipeId,
            recipeId: el._id,
            title: el.label,
            author: el.source,
            image: el.image,
            ingredients: el.ingredientLines,
            time: el.totalTime,
            servings: el.yield,
          };
          recipes.push(recipeData);
        });

        // Add recieved recipes to the liked recipes
        this.likes = recipes;
      })
      .fail((err) => {
        const error = JSON.parse(err.responseText);
        alert(error.error);
      });
  }

  deleteLikedRecipe(id) {
    // match id with this.likes likes
    let recipeId;

    this.likes.forEach((el) => {
      if (el.id === id) {
        recipeId = el.recipeId;
      }
    });

    return $.ajax({
      type: "DELETE",
      url: `${process.env.API_URL}/deleteLikedRecipe/${recipeId}`,
      headers: {
        Authorization: window.localStorage.getItem("forkifyToken"),
      },
    })
      .done((result) => {})
      .fail((err) => {
        const error = JSON.parse(err.responseText);
        alert(error.error);
      });
  }
}
