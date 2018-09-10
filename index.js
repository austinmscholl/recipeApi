// URL to get latest launch
const baseURL = 'https://api.edamam.com/search'; //https://api.edamam.com/api/food-database/parser (something is wrong.)
const key = "10f88cc59077f07bc6fd8ce9ee08d3e6";
const appId = "9a6a060b";
let url;

// Get launch data from API
const submitBtn = document.querySelector('.submit');
const searchForm = document.querySelector('form');
const searchTerm = document.querySelector('.search');

// Results Navigation
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');
const nav = document.querySelector('nav');
const resultsSection = document.querySelector('.results');
let pageNumber = 0;

let displayNav = false;

// Results Section
const section = document.querySelector('section');

// Event Listeners
searchForm.addEventListener('submit', fetchResults);
nextBtn.addEventListener('click', nextPage);
previousBtn.addEventListener('click', previousPage);

function submitSearch(e) {
    pageNumber = 0;
    fetchResults(e);
}

function fetchResults(e) {
    e.preventDefault();
    url = `${baseURL}?q=${searchTerm.value}&app_id=${appId}&app_key=${key}&page=${pageNumber}`
    console.log("URL:", url);

    fetch(url)
        .then(function(result) {
            console.log(result)
            return result.json();
        })
        .then(function(json) {
            console.log(json);

            // const recipes = json.hits.map(
            //     function (hit) {
            //         return hit.recipe;
            //     }
            // )
            let recipeArray = [];
            for (i = 0; i < json.hits.length; i++) {
            recipeArray.push(json.hits[i].recipe);
            }
            console.log(recipeArray);
            displayResults(recipeArray);
        });
}

function displayResults(json) {
    while(section.firstChild) {
        section.removeChild(section.firstChild);
    }

    let articles = json;

    console.log(articles);

    if(articles.length === 10 && pageNumber === 0) {        // articles.length === 10
        nav.style.display = 'block';
        previousBtn.style.display = 'none';
    } else if(articles.length === 10) {
        nav.style.display = 'block';
        previousBtn.style.display = 'block'
    } else if(articles.length < 10 && articles.length > 1) {
        nav.style.display = 'block';
        previousBtn.style.display = 'block';
        nextBtn.style.display = 'none';
    } else {
        nav.style.display = 'none';
    }

    if(articles.length === 0) {
        console.log("No results");
    } else {
        for(i = 0; i < articles.length; i++) {
            let article = document.createElement('article');
            let heading = document.createElement('h2');
            let link = document.createElement('a');
            let img = document.createElement('img');
            let para = document.createElement('p');
            let clearfix = document.createElement('div');

            let current = articles[i];
            console.log("Current:", current);

            link.href = current.url;
            link.textContent = current.label;

            para.textContent = 'Health Labels: ';

            for(j = 0; j < current.healthLabels.length; j++) {
                let span = document.createElement('span');
                span.textContent += current.healthLabels[j] + ' ';
                para.appendChild(span);
            }

            if(current.image.length > 0) {
                img.src = current.image;
                img.alt = current.label;
            }

            clearfix.setAttribute('class','clearfix');

            article.appendChild(heading);
            heading.appendChild(link);
            article.appendChild(img);
            article.appendChild(para);
            article.appendChild(clearfix);
            section.appendChild(article);
        }
    }
};


function nextPage(e) {
    pageNumber++;
    fetchResults(e);
}

function previousPage(e) {
    if(pageNumber > 0) {
        pageNumber--;
    } else {
        return;
    }
    fetchResults(e);
}