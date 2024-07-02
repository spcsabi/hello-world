import countries from './frontend/data.js';
import { selectedCountry, mapPointer } from './frontend/script.js';

let arrPointer;
const getCurrentIndex = () => arrPointer;
const setCurrentIndex = (value) => (arrPointer = value);

let actualTranslation;
const getActualTranslation = () => actualTranslation;
const setActualTranslation = (value) => (actualTranslation = value);

const countryEl = document.getElementById('country');

export function runOnce() {
  navButtons();
  addTranslations();
  revealButtons();
}

export function handleSelect(event) {
  const previousButton = document.querySelector('#prev');
  const currentCountry = event.target.value;

  if (currentCountry === 'Please choose a country') {
    console.log('No such country.');
    return;
  }

  const findCountry = countries.find(
    (country) => country.name.common === currentCountry
  );

  const historySize = selectedCountry.push(findCountry);
  setCurrentIndex(historySize - 1);

  if (historySize > 1) {
    previousButton.removeAttribute('disabled');
  }

  // Empty #country before append new elements
  countryEl.innerHTML = '';

  countryEl.append(
    getDetailsFragment(findCountry),
    areaPopulationDivFragment() // Better to define in reka and csabi function
  );
  revealButtons();
}

function createNode(tagName, attributes = {}) {
  const el = document.createElement(tagName);

  for (const key of Object.keys(attributes)) {
    el[key] = attributes[key];
  }
  return el;
}

function areaPopulationDivFragment() {
  const fragment = document.createDocumentFragment();

  const divCountryArea = createNode('div', { id: 'country_area' });
  const divCountryPopulation = createNode('div', { id: 'country_population' });

  fragment.append(divCountryArea, divCountryPopulation);

  return fragment;
}

function getDetailsFragment(lastSelected) {
  const fragment = document.createDocumentFragment();
  const {
    flags: { png },
    name: { common },
    region,
    subregion,
    capital,
    translations,
  } = lastSelected;
  const lngShort = getActualTranslation();
  let isTrAvlailable = false;
  let trName = '';

  if (Object.keys(translations).includes(lngShort)) {
    trName = translations[lngShort].common;
    isTrAvlailable = true;
  }

  const pEl = createNode('p', { id: 'paragraph' });
  pEl.appendChild(
    createNode('img', {
      src: png,
      id: 'flag',
      alt: `flag-of-${common.toLowerCase()}`,
    })
  );
  fragment.appendChild(pEl);
  fragment.appendChild(
    createNode('h1', { innerText: isTrAvlailable ? trName : common }) //User is not informed if tr is nat available
  );
  fragment.appendChild(createNode('h2', { innerText: `Region: ${region}` }));
  fragment.appendChild(
    createNode('h3', { innerText: `Sub-region: ${subregion}` })
  );
  fragment.appendChild(createNode('h4', { innerText: `Capital: ${capital}` }));

  return fragment;
}

function navButtons() {
  const toolbarEl = document.querySelector('.historyNav');

  const prev = createNode('button', {
    innerText: 'Previous country',
    className: 'naviButton',
    id: 'prev',
    disabled: true,
  });
  const next = createNode('button', {
    innerText: 'Next country',
    className: 'naviButton',
    id: 'next',
    disabled: true,
  });
  next.addEventListener('click', handleNextClick);
  prev.addEventListener('click', handlePrevClick);

  toolbarEl.append(prev, next);
}

function revealButtons() {
  const populatonButton = document.querySelector('#population');
  const areaButton = document.querySelector('#area');

  populatonButton.removeAttribute('hidden');
  areaButton.removeAttribute('hidden');
}

function toggleDisableAttrib(index) {
  const nextButton = document.querySelector('#next');
  const previousButton = document.querySelector('#prev');
  const selectedCountrySize = selectedCountry.length;

  if (index === selectedCountrySize - 1) {
    nextButton.setAttribute('disabled', '');
  } else if (index < selectedCountrySize) {
    nextButton.removeAttribute('disabled');
  }
  if (index === 0) {
    previousButton.setAttribute('disabled', '');
  } else if (index > 0) {
    previousButton.removeAttribute('disabled');
  }
}

function handleNextClick() {
  let currentIndex = getCurrentIndex();

  currentIndex++;
  setCurrentIndex(currentIndex);
  toggleDisableAttrib(currentIndex);

  countryEl.innerHTML = '';
  countryEl.append(
    getDetailsFragment(selectedCountry[currentIndex]),
    areaPopulationDivFragment()
  );
  showOnMap(selectedCountry[currentIndex]);
}

function handlePrevClick() {
  let currentIndex = getCurrentIndex();

  currentIndex--;
  setCurrentIndex(currentIndex);
  toggleDisableAttrib(currentIndex);

  countryEl.innerHTML = '';
  countryEl.append(
    getDetailsFragment(selectedCountry[currentIndex]),
    areaPopulationDivFragment()
  );
  showOnMap(selectedCountry[currentIndex]);
}

function addTranslations() {
  const selectorsDiv = document.querySelector('.selectors');
  const trList = Object.keys(countries[0].translations);
  const languages = {
    ara: 'Arabic',
    ces: 'Czech',
    cym: 'Welsh',
    deu: 'German',
    est: 'Estonian',
    fin: 'Finnish',
    fra: 'French',
    hrv: 'Croatian',
    hun: 'Hungarian',
    ita: 'Italian',
    jpn: 'Japanese',
    kor: 'Korean',
    nld: 'Dutch',
    per: 'Persian',
    pol: 'Polish',
    por: 'Portuguese',
    rus: 'Russian',
    slk: 'Slovak',
    spa: 'Spanish',
    swe: 'Swedish',
    urd: 'Urdu',
    zho: 'Chinese',
  };

  const newSelect = createNode('select', { id: 'translations' });
  newSelect.appendChild(createNode('option', { selected: null }));
  for (const translation of trList) {
    newSelect.appendChild(
      createNode('option', {
        value: `${translation}`,
        innerText: `${languages[translation]}`,
      })
    );
  }

  newSelect.addEventListener('change', handleTrChange);

  selectorsDiv.appendChild(newSelect);
}

function handleTrChange(event) {
  const selectedTranslation = event.target.value;
  setActualTranslation(selectedTranslation);
  const currentIndex = getCurrentIndex();

  countryEl.innerHTML = '';
  countryEl.append(
    getDetailsFragment(selectedCountry.at(currentIndex)),
    areaPopulationDivFragment()
  );
}

function showOnMap(lastSelected) {
  const geoInfo = lastSelected.latlng;
  const lat = (Math.abs(geoInfo[0] - 90) / 180) * 100;
  const lng = ((geoInfo[1] + 180) / 360) * 100;
  mapPointer.style = `visibility: visible; top: ${lat}%; left: ${lng}%`;
}
