const URL = "https://swapi.dev/api/people/";

const personList = document.querySelector('.box.characters ul');
personList.addEventListener('click', clickCharacter);  //  personSelected

const actor = document.getElementById('actor');
const planet = document.getElementById('planet');

let pageNbr = 1;

// Init character list Get numbered page from server
setCharacterList(pageNbr);  

function clickCharacter(event) {
    if ( !event.target.classList.contains('target') ) {
        // Previous target
        const previousLi = document.querySelector('.box.characters ul li.target');
        if (previousLi) {
            previousLi.classList.remove('target');
        }

        // New target
        event.target.classList.add('target');
        const id = parseInt( event.target.id);
        getCharacter(id);
    }
}

const getCharacter = async (id) => {
    // console.log('==> getCharacter(' +  id + ')');
    const loader = document.querySelector('.box.details .loader');
    loader.classList.add('show');  // Show loader

     // Clear previous info
    actor.children[0].innerHTML = '';  // h3
    actor.children[1].innerHTML = '';  // ul
    
    let url = URL + `${id + 1}`;  
    // console.log('url: ' + url);
    
    let dataUser;
    let dataSpecies;
    let dataPlanet;
     
    let response = await fetch(url);
    let data = await response.json();
    dataUser = data;
    // console.log('dataUser: ', dataUser);

    if (data.species.length > 0) {
        response = await fetch(data.species[0]);
        dataSpecies = await response.json();
        // console.log('dataSpecies: ', dataSpecies);
    }
    displayCharacterDetails(dataUser, dataSpecies);  // Show data

    if (data.homeworld) {
        response = await fetch(data.homeworld);
        dataPlanet = await response.json();
         console.log('dataPlanet: ', dataPlanet);
        displayPlanetDetails(dataPlanet);
    }

    loader.classList.remove('show');  // Hide loader
}

function displayCharacterDetails(userData, speciesData) {
    // console.log('==> addActorDetails()');
    // console.log('userData', userData);
    // console.log('speciesData:', speciesData);
    // Set h3
    actor.firstElementChild.innerText = userData['name'];
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
    actor.lastElementChild.innerHTML = liList;
}

function displayPlanetDetails(planetData) {
    if (planetData) {
        planet.children[0].innerText = planetData['name'];
        const liList = `
            <li>Rotation period: <span>${planetData.rotation_period}</span></li>
            <li>Orbital period: <span>${planetData.orbital_period}</span></li>
            <li>Diameter: <span>${planetData.diameter}</span></li>
            <li>Climate: <span>${planetData.climate}</span></li>
            <li>Gravity: <span>${planetData.gravity}</span></li>
            <li>Terrain: <span>${planetData.terrain}</span></li>
        `;
        planet.children[1].innerHTML = liList;
    }
}

function setCharacterList(pageNbr = 1) {
    // console.log(`--> setCharacterList(${pageNbr})`);
    
    let max = 11;  // Show max people
    let url = URL;
    if (pageNbr > 1) {
        url += "?page=" + (pageNbr);
    }
    // console.log('url: ' + url);  // https://swapi.dev/api/people/?page=2
    
    const loader = document.querySelector('.box.characters .loader');
    loader.classList.add('show');

    fetch(url)
        .then((repsonse) => repsonse.json())
        .then((data) => {
            // console.log(data);
            if (data.results.length < max) {
                max = (data.results.length);
            }
            for (let i = 0; i < max; i++) {
                const item = `<li id="${(pageNbr - 1) * 10 + i}">${data.results[i]['name']}</li>`;
                //  console.log(item);
                personList.insertAdjacentHTML('beforeend', item);
                loader.classList.remove('show');
            }
        })
        .catch((error) => console.error('Error:', error))
}