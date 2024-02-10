const URL = "https://swapi.dev/api/people/";

const displayCharacters = document.querySelector('.box.characters ul');
displayCharacters.addEventListener('click', clickCharacter);  //  personSelected

const btnPrevious = document.getElementById('btnPrevious');
btnPrevious.addEventListener('click', clickPreviousPage);

const btnNext = document.getElementById('btnNext');
btnNext.addEventListener('click', clickNextPage);

const characterDisplay = document.getElementById('actor');
const planetDisplay = document.getElementById('planet');





let pageNbr = 8;

// Init character list Get numbered page from server
importCharacterList(pageNbr);  

/*====== User action ======*/
function clickCharacter(event) {
    // Must be LI (listening to ul) and not already clicked
    if ( event.target.tagName === 'LI' && !event.target.classList.contains('target') ) {
        // Previous target
        const previousLi = document.querySelector('.box.characters ul li.target');
        if (previousLi) {
            previousLi.classList.remove('target');
        }

        // New target
        event.target.classList.add('target');
        const id = parseInt( event.target.id);
        importIndividualCharacter(id);
    }
}

function clickPreviousPage(event) {
    // console.log('--> clickPreviousPage() pageNbr: '+pageNbr+', ');

    if (pageNbr >= 2) {  // Can go to previous page
        const newPageNbr = pageNbr - 1;
        
        importCharacterList(newPageNbr);  // Get, display, loader
    }
    else {
        console.log('pageNbr to small');
    }
}

function clickNextPage(event) {
    //  console.log('--> clickNextPage() pageNbr: '+pageNbr+' => ' + (pageNbr + 1));
    if ( !event.target.classList.contains('disabled')) {
        const newPageNbr = pageNbr + 1;
        importCharacterList(newPageNbr);  // Get, display, loader
    }
}


/*====== Import ======*/
function importCharacterList(pageId = 1) {
    // console.log(`--> importCharacterList(${pageId})`);
    
    let max = 10;  // Show max people
    let url = URL;
    if (pageId > 1) {
        url += "?page=" + (pageId);
    }
    // console.log('url: ' + url);  // https://swapi.dev/api/people/?page=2
    
    // Empty list
    displayCharacters.innerHTML = '';
    // Empty Details/Planet
    characterDisplay.children[0].innerHTML = '';  // h3
    characterDisplay.children[1].innerHTML = '';  // ul
    planetDisplay.children[0].innerHTML = '';
    planetDisplay.children[1].innerHTML = '';

    const loader = document.querySelector('.box.characters .loader');
    loader.classList.add('show');



    fetch(url)
        .then((repsonse) => repsonse.json())
        .then((data) => {
            // console.log(data);
            displayCharacterList(data.results, max);
            displayPagination(pageId, data.count);
        })
        .catch((error) => console.error('Error:', error))
        .finally(() => {
            // console.log('finally... removing loader');
            loader.classList.remove('show');
            pageNbr = pageId;
        })
}

const importIndividualCharacter = async (id) => {
    // console.log('==> getCharacter(' +  id + ')');
    const loader = document.querySelector('.box.details .loader');
    loader.classList.add('show');  // Show loader

     // Clear previous info
    characterDisplay.children[0].innerHTML = '';  // h3
    characterDisplay.children[1].innerHTML = '';  // ul
    
    let url = URL + `${id}`;  
    // console.log('url: ' + url);  // Individual user
    
    let dataUser;
    let dataSpecies;
    let dataPlanet;
     
    let response = await fetch(url);
    let data = await response.json();
    dataUser = data;
    // console.log('dataUser: ', dataUser);

    if (data.species && data.species.length > 0) {
        response = await fetch(data.species[0]);
        dataSpecies = await response.json();
        // console.log('dataSpecies: ', dataSpecies);
    }
    displayCharacterDetails(dataUser, dataSpecies);  // Show data

    if (data.homeworld) {
        response = await fetch(data.homeworld);
        dataPlanet = await response.json();
        // console.log('dataPlanet: ', dataPlanet);
        displayPlanetDetails(dataPlanet);
    }

    loader.classList.remove('show');  // Hide loader
}


/*====== Display ======*/
function displayCharacterList(array, max) {
    // console.log('--> displayCharacterList(array, '+max+')');
    // console.log('array:', array);

    if (max > array.length) {
        max = array.length;
    }

    // console.log('max: ' + max);
    for (let i = 0; i < max; i++) {
        // Get id from:  https://swapi.dev/api/people/82/
        let string = array[i].url.slice(0, -1);
        let id = string.slice(string.lastIndexOf('/') + 1);
        // console.log('id: ' + id);

        const item = `<li id="${id}">${array[i]['name']}</li>`;
        displayCharacters.insertAdjacentHTML('beforeend', item);
    }
}

function displayPagination(newPageNbr, pageMax) {  // 1, 9 || 2, 9 || 9, 9
    // console.log('--> displayPagination(' + newPageNbr + ', ' + pageMax + ')');
    
    let act = document.getElementById('nbrAct');
    act.innerText = newPageNbr;

    let tmpNbr = Math.ceil(pageMax / 10);  // find last page
    document.getElementById('nbrMax').innerText = tmpNbr;  // Math.ceil(pageMax / 10);

    // show footer after first import!
    if ( !pageNbr ) {  
        document.querySelector('.box.characters footer').classList.remove('hidden');
    }

    // arrow previous
    if (newPageNbr <= 1) {  // To 1
        btnPrevious.classList.add('disabled');
    }
    else if (pageNbr === 1) {  // From 1
        btnPrevious.classList.remove('disabled');
    }

    // arrow next
    if (newPageNbr === tmpNbr) {  // To max
        btnNext.classList.add('disabled');
    }
    else if (pageNbr === tmpNbr) {
        btnNext.classList.remove('disabled');
    }
}

function displayCharacterDetails(userData, speciesData) {
    // console.log('==> addActorDetails()');
    // console.log('userData', userData);
    // console.log('speciesData:', speciesData);
    // Set h3
    characterDisplay.firstElementChild.innerText = userData['name'];

    // Set characters data
    const liList = `
        <li>Height:<span class="height">${userData.height}</span></li>
        <li>Mass:<span class="mass">${userData.mass}</span></li>
        <li>Hair color:<span class="hair-color">${userData.hair_color}</span></li>
        <li>Skin color:<span class="skin-color">${userData.skin_color}</span></li>
        <li>Eye color:<span class="eye-color">${userData.eye_color}</span></li>
        <li>Birth year:<span class="birth-year">${userData.birth_year}</span></li>
        <li>Species:<span class="species">${(speciesData ? speciesData.classification : '-')}</span></li>
        <li>Gender:<span class="gender">${userData.gender}</span></li>
    `;
    characterDisplay.lastElementChild.innerHTML = liList;
}

function displayPlanetDetails(planetData) {
    if (planetData) {
        planetDisplay.children[0].innerText = planetData['name'];
        const liList = `
            <li>Rotation period: <span>${planetData.rotation_period}</span></li>
            <li>Orbital period: <span>${planetData.orbital_period}</span></li>
            <li>Diameter: <span>${planetData.diameter}</span></li>
            <li>Climate: <span>${planetData.climate}</span></li>
            <li>Gravity: <span>${planetData.gravity}</span></li>
            <li>Terrain: <span>${planetData.terrain}</span></li>
        `;
        planetDisplay.children[1].innerHTML = liList;
    }
}