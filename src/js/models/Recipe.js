import axios from 'axios';
// import { apiAppID, apiKey } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    };

    async getRecipe() {
        try {
            const url = 'http://www.edamam.com/ontologies/edamam.owl#';
            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const baseURL = `https://api.edamam.com`;
            const encodedURI = encodeURIComponent(`${url}${this.id}`);
            const apiAppID = process.env.apiAppID;
            const apiKey = process.env.apiKey;

            const res = await axios(`${proxy}${baseURL}/search?r=${encodedURI}&app_id=${apiAppID}&app_key=${apiKey}`)
            // const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.img = res.data[0].image;
            this.author = res.data[0].source;
            this.title = res.data[0].label;
            this.url = res.data[0].url;
            this.ingredients = res.data[0].ingredientLines;
            this.time = res.data[0].totalTime;
            this.times = res.data[0].totalTime;
            this.servings = res.data[0].yield;
            return this;
        } catch(error) {
            alert('Something went wrong :(');
        }
    };

    async getRecipeFromDb() {
        try {
            const res = await axios.get(`https://forkify--api.herokuapp.com/getRecipe/${this.id}`, {
                headers: {
                  'Authorization': window.localStorage.getItem('forkifyToken')
                }
            });
            // JSON.parse(r)
            this.img = res.data.image;
            this.author = res.data.source;
            this.title = res.data.label;
            this.ingredients = res.data.ingredientLines;
            this.time = res.data.totalTime;
            this.times = res.data.totalTime;
            this.servings = res.data.yield;
            return res.data;            
        } catch (error) {
            alert('Something went wrong :(');
        }
    };

    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const period = Math.ceil(numIng / 3);
        this.time = period * 15;
        this.times = this.time;
    };

    calcServings() {
        this.servings = 1;
    };

    parseIngredients() {
        const newIngredients = this.ingredients.map(el => {            
            // 1). Uniform units
            const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
            const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
            const units = [...unitsShort, 'kg', 'g'];

            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2). Remove parentheses and extra space
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            ingredient = ingredient.replace(/  +/g, ' ');

            // 3). Perse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] ---> eval('4 + 1/2') ---> 4.5
                // Ex. 4 cups, arrcount is [4]

                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }   

            } else if (parseInt(arrIng[0], 10)) {
                // There is no unit but 1st element is number
                objIng = {
                    count: (parseInt(arrIng[0], 10)),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }

            } else if (unitIndex == -1) {
                // There is NO unit and NO count at 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;

        });
        this.ingredients = newIngredients;
    };

    updateServings(type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });
        
        this.time = this.times * newServings;
        this.servings = newServings;
    };

};