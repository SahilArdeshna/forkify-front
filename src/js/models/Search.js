import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  };

  async getResults() {
    try {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const baseURL = 'https://api.edamam.com';
        const apiAppID = process.env.apiAppID;
        const apiKey = process.env.apiKey;

        const res = await axios(`${proxy}${baseURL}/search?q=${this.query}&from=0&to=50&app_id=${apiAppID}&app_key=${apiKey}`, {
          headers: {
            'Access-Contoll-Allow-Origin': '*'
          }
        });
        // const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
        this.result = res.data.hits;
        console.log(this.result);
        return this.result;
    } catch(error) {
        alert(error);
    }
  };

  async getResultsFromDb() {
    const recipes = [];
    try {
      const res = await axios.get(`https://forkify--api.herokuapp.com/getRecipes`, {
        headers: {
          'Authorization': window.localStorage.getItem('forkifyToken')
        }
      });

      if (!res.data) {
        alert('Recipes not found! Please add recipes!');
      }

      res.data.forEach(resData => {
        resData.favRecipe = true;
        recipes.push({recipe: resData})
      });       
      this.result = recipes;
      return this.result; 
    } catch(error) {
      alert(error);
    }
  }
};
 
