console.log('js');

const personList = document.querySelector('.box.characters ul');
personList.addEventListener('click', personSelected);
 console.log(personList);

function personSelected(event) {
    console.log('--> personSelected()');
    // console.log(event);
    console.log('id: ' + event.target.id)
}

let pageNbr = 1;




setPersons(1);  // Get numbered page from server

function setPersons(pageNbr = 1) {
     console.log(`--> setPersons(${pageNbr})`);
    
    

    let max = 8;  // Show max people
    let url = "https://swapi.dev/api/people/";
    if (pageNbr > 1) {
        url += "?page=" + (pageNbr);
    }

    // https://swapi.dev/api/people/
    // https://swapi.dev/api/people/?page=2
     console.log('url: ' + url)
    
    const loader = document.querySelector('.box.characters .loader');
    loader.classList.add('show');

    fetch(url)
        .then((repsonse) => repsonse.json())
        .then((data) => {
            // console.log(data);

            for (let i = 0; i < data.results.length; i++) {
                // const element = data.results[i];
                // console.log(element);
                const item = `<li id="${(pageNbr - 1) * 10 + i}">${data.results[i]['name']}</li>`;
                //  console.log(item);
                personList.insertAdjacentHTML('beforeend', item);
                loader.classList.remove('show');
            }

        })
        .catch((error) => console.error('Error:', error))
}