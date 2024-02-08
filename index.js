const URL = "https://swapi.dev/api/people/";

const personList = document.querySelector('.box.characters ul');
personList.addEventListener('click', clickCharacter);  //  personSelected

let pageNbr = 1;

// Init character list Get numbered page from server
setCharacterList(pageNbr);  

function clickCharacter(event) {
    const id = parseInt( event.target.id);
    getCharacter(id);
}

const getCharacter = async (id) => {
    // console.log('==> getCharacter(' +  id + ')');
    const loader = document.querySelector('.box.details .loader');
    loader.classList.add('show');

     // Clear previous info
    const actor = document.getElementById('actor');
    actor.lastElementChild.children.remove;
    const planet = document.getElementById('home-planet');
    planet.lastElementChild.children.remove;
    
    let url = URL + `${id + 1}`;  
    // console.log('url: ' + url);
    
    let dataUser;
    let dataSpecies;
     
    let response = await fetch(url);
    let data = await response.json();
    dataUser = data;

    // console.log('data: ', data);
    // console.log('species:', data.species);
    if (data.species.length > 0) {
         // console.log('Got data.species');
        response = await fetch(data.species[0]);
        dataSpecies = await response.json();
    }
    // console.log('dataUser:' , dataUser);
    // console.log('dataSpecies:' , dataSpecies);

    addActorDetails(actor, dataUser, dataSpecies);  // Show data
    loader.classList.remove('show');
}

function addActorDetails(element, userData, speciesData) {
    // console.log('==> addActorDetails()');
    // console.log('userData', userData);
    // console.log('speciesData:', speciesData);
    // Set h3
    element.firstElementChild.innerText = userData['name'];
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
    element.lastElementChild.innerHTML = liList;
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