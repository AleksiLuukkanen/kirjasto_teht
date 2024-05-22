const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results');

searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  const isCity = query.includes(' ');
  resultsContainer.innerHTML = '';

  if (isCity) {
    fetch(`https://api.kirjastot.fi/v4/city?q=${query}`)
      .then((response) => response.json())
      .then((data) => {
        data.items.forEach((city) => {
          fetch(`https://api.kirjastot.fi/v4/library?city=${city.id}`)
            .then((response) => response.json())
            .then((data) => {
              data.items.forEach((library) => {
                const resultContainer = createResultContainer(library);
                resultsContainer.appendChild(resultContainer);
              });
            })
            .catch((error) => {
              console.error(error);
            });
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  else {
    fetch(`https://api.kirjastot.fi/v4/library?q=${query}`)
      .then((response) => response.json())
      .then((data) => {
        data.items.forEach((library) => {
          const resultContainer = createResultContainer(library);
          resultsContainer.appendChild(resultContainer);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

function createResultContainer(library) {
  const resultContainer = document.createElement('div');
  resultContainer.classList.add('result-container');

  const imgElement = document.createElement('img');
  imgElement.classList.add('img-kirjasto');
  imgElement.src = library.coverPhoto.small.url;
  imgElement.alt = library.name;
  resultContainer.appendChild(imgElement);

  const nameElement = document.createElement('p');
  nameElement.textContent = `Kirjaston nimi: ${library.name}`;
  resultContainer.appendChild(nameElement);

  const addressElement = document.createElement('p');
  addressElement.textContent = `Osoite: ${library.address.street}, ${library.address.zipcode}`;
  resultContainer.appendChild(addressElement);

  const sloganElement = document.createElement('p');
  sloganElement.textContent = `Seloste: ${library.slogan}`;
  resultContainer.appendChild(sloganElement);

  return resultContainer;
}

resultsContainer.style.overflow = 'auto';
resultsContainer.style.height = '500px';