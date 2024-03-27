
//caching the DOM
  const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  nutritianMealsEl = document.getElementById('nutrition-meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');
  const apiKey='77370946cd2e4505a53c9756c41830aa';
  const apiUrl=`https://api.spoonacular.com/recipes/findByNutrients`;
 


  //nutritian api calls starts here
//search meal by nutrients
function getRecipesByNutrients(e){
e.preventDefault();
 single_mealEl.innerHTML = '';
  const minCarbs=document.getElementById('minCarbs').value;
  const maxCarbs=document.getElementById('maxCarbs').value;
  const minSugar=document.getElementById('minSugar').value;
  const maxSugar=document.getElementById('maxSugar').value;
  const minFat=document.getElementById('minFat').value;
  const maxFat=document.getElementById('maxFat').value;
  const filters=[];
  if(minCarbs){
    filters.push(`minCarbs=${minCarbs}`);
  }
  if(maxCarbs){
    filters.push(`maxCarbs=${maxCarbs}`);
  }
  if(minSugar){
    filters.push(`minSugar=${minSugar}`);
  }
  if(maxSugar){
    filters.push(`maxSugar=${maxSugar}`);
  }
  if(minFat){
    filters.push(`minFat=${minFat}`);
  }
  if(maxFat){
    filters.push(`maxFat=${maxFat}`);
  }
  //converting the array into string and putting & between each element
  const filtersString=filters.join('&');


  //api end point of the spoonacular api
  const url=`${apiUrl}?apiKey=${apiKey}&${filtersString ? `${filtersString}` :''}&number=10`;
 //we are making a get request to the api
  fetch(url).then((res)=>{
    return res.json();
  }).then((data)=>{
    console.log(data);
    const html=data.map((recipe)=>{
      return `<div class="meal">
      <img src="${recipe.image}" alt="${recipe.title}" />
      <div class="meal-info" 
      data-mealID="${recipe.id}" 
      data-fat="${recipe.fat}"
      data-carbs="${recipe.carbs}"
      data-calories="${recipe.calories}"
      data-protein="${recipe.protein}"
      >
        <h3>${recipe.title}</h3>
      </div>
    </div>`;
    }).join('');
    nutritianMealsEl.innerHTML=html;
  }).catch((err)=>{
    console.log(err);
  });
  }

//fetch meal by id in netrution api
function getMealByIdNutrition(mealID,[fat,carbs,calories,protein]) {
  fetch(`https://api.spoonacular.com/recipes/${mealID}/information?apiKey=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const meal = data;
      console.log(meal);
      addMealToDOMNutrition(meal,[fat,carbs,calories,protein]);
      single_mealEl.scrollIntoView({ behavior: 'smooth' });
    });
}

//add meal to dom in nutrition api
function addMealToDOMNutrition(meal,[fat,carbs,calories,protein]) {
const ingredients=meal.extendedIngredients.map((ing)=>ing.original);
const healthData=[fat,carbs,calories,protein];
  //extendedingridents--->original
  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.title}</h1>
      <img src="${meal.image}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        'fat:' ${healthData[0]}
        'carbs:' ${healthData[1]}
        'calories:' ${healthData[2]}
        'protein:' ${healthData[3]}
        ${meal.vegetarian ? `<p>Vegetarian</p>` : 'Non Vegetarian'}
        ${meal.readyInMinutes? `<p>${meal.readyInMinutes}mins</p>` : ''}

      </div>
      <div class="main">
        <p>${meal.instructions}</p>
        <h2>Ingredients</h2>
                <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;

}


//nutritions api calls end here


//search by ingridients api call starts here

// Search meal and fetch from API by ingredients
function searchMeal(e) {
  e.preventDefault();

  // Clear single meal
  single_mealEl.innerHTML = '';

  // Get search term
  const term = search.value;

  // Check for empty
  if (term.trim()) {
    
    fetch(`https://www.themealdb.com/api/json/v2/9973533/filter.php?i=${term}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              meal => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `
            )
            .join('');
        }
      });
    // Clear search text
    search.value = '';
  } else {
    alert('Please enter a search term');
  }
}


// Fetch meal by ID
function getMealById(mealID) {
  console.log('hi')
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      console.log(meal)

      addMealToDOM(meal);
       single_mealEl.scrollIntoView({ behavior: 'smooth' });
    });
}

// Fetch random meal from API
function getRandomMeal() {
  // Clear meals and heading
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Add meal to DOM
function addMealToDOM(meal) {
  console.log(meal);
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}







// Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

nutritianMealsEl.addEventListener('click', e => {
  const mealInfo = e.target.closest('.meal-info');

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    const fat=mealInfo.getAttribute('data-fat');
    const carbs=mealInfo.getAttribute('data-carbs');
    const calories=mealInfo.getAttribute('data-calories');
    const protein=mealInfo.getAttribute('data-protein');
    getMealByIdNutrition(mealID,[fat,carbs,calories,protein]);
  }
});
mealsEl.addEventListener('click', e => {
  const mealInfo = e.target.closest('.meal-info');

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    
    getMealById(mealID,);
  }
});
document.getElementById('nutritionForm').addEventListener('submit',getRecipesByNutrients);