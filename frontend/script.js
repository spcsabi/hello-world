import countries from "./data.js";
import mapPin from "./assets/mapPin.js";

import {
  fillSlider,
  setToggleAccessible,
  controlFromSlider,
  controlToSlider,
  controlFromInput,
  controlToInput,
} from "./slider.js";
let countriesFiltered = countries;

const body = document.querySelector("body");

const searchBar = document.querySelector("#search-bar");
const populationFilterLessThan = document.querySelector(
  "#population-to-slider"
);
const populationFilterMoreThan = document.querySelector(
  "#population-from-slider"
);
const areaFilterLessThan = document.querySelector("#area-to-slider");
const areaFilterMoreThan = document.querySelector("#area-from-slider");

const dropdownContent = document.querySelector("#dropdown-content");

const mapContainer = document.querySelector("#map_container");

function main() {
  countriesFiltered.forEach((country) => {
    createPointer(country);
    createCountryName(country);
  });
  filterCountriesBySearchBar();
  filterCountriesByPopulation();
  filterCountriesByArea();
  slider();

  searchBar.addEventListener("input", hideFiltered);
  populationFilterLessThan.addEventListener("input", hideFiltered);
  populationFilterMoreThan.addEventListener("input", hideFiltered);
  areaFilterLessThan.addEventListener("input", hideFiltered);
  areaFilterMoreThan.addEventListener("input", hideFiltered);

  showDropdown();
  onClose();
}

function hideFiltered() {
  const mapPointers = mapContainer.querySelectorAll(".map_pointer_container");
  const countryNames = dropdownContent.querySelectorAll(".dropdown__element");
  hideList(mapPointers);
  hideList(countryNames);
}

function hideList(list) {
  list.forEach((el) => {
    if (
      el.filterByName ||
      el.filterByLessPopulation ||
      el.filterByMorePopulation ||
      el.filterByLessArea ||
      el.filterByMoreArea
    ) {
      el.style.display = "none";
    } else {
      el.style.display = "";
    }
  });
}

function showDropdown() {
  searchBar.addEventListener("click", () => {
    searchBar.placeholder = "Search...";
    dropdownContent.classList.toggle("show");
  });
}

function showOnMap(country) {
  mapContainer.querySelectorAll(`.map_pointer_container`).forEach((el) => {
    el.style.display = "";
    el.id !== country.cca3 ? (el.style.display = "none") : {};
  });
}

function onClose() {
  let lastEvent = null;
  window.addEventListener("click", (event) => {
    if (
      !event.target.matches(".search-bar__input") &&
      !event.target.matches(".map_pointer") &&
      !event.target.parentNode.matches(".sliders_control")
    ) {
      const dropdowns = document.querySelectorAll(".dropdown-content");
      dropdowns.forEach(function (dropdown) {
        if (dropdown.classList.contains("show")) {
          dropdown.classList.remove("show");
        }
      });
    }
    if (
      !event.target.matches(".search-bar__input") &&
      !lastEvent?.target.matches(".search-bar__input") &&
      !event.target.matches(".country_card") &&
      !event.target.parentNode.parentNode.matches(".country_card") &&
      !event.target.parentNode.matches(".country_details") &&
      !event.target.parentNode.matches(".flag_container") &&
      !event.target.parentNode.matches(".sliders_control") &&
      !event.target.matches("path") &&
      !event.target.matches(".map_pointer") &&
      !event.target.matches(".map_pointer_containter")
    ) {
      console.log(event.target);
      mapContainer.querySelectorAll(`.map_pointer_container`).forEach((el) => {
        el.style.display = "";
      });
      searchBar.placeholder = "Search...";
      const country_detail = document.querySelectorAll(".country_card");
      if (country_detail.length > 0) {
        country_detail.forEach((e) => {
          e.innerHTML = "";
          e.classList = "";
        });
      }
    }
    lastEvent = event;
  });
}

function filterCountriesBySearchBar() {
  searchBar.addEventListener("input", (input) => {
    const filter = input.target.value.toLowerCase();

    const countryNames = dropdownContent.querySelectorAll(".dropdown__element");
    countryNames.forEach((countryName) => {
      if (
        countryName.innerText.toLowerCase().indexOf(filter) > -1 ||
        countryName.countryCapital.toLowerCase().startsWith(filter) ||
        countryName.countryContinent.toLowerCase().startsWith(filter) ||
        countryName.countryCca3.toLowerCase().startsWith(filter)
      ) {
        countryName.filterByName = false;
      } else {
        countryName.filterByName = true;
      }
    });
    const mapPointers = mapContainer.querySelectorAll(".map_pointer_container");
    mapPointers.forEach((pointer) => {
      if (
        pointer.countryName.toLowerCase().indexOf(filter) > -1 ||
        pointer.countryCapital.toLowerCase().startsWith(filter) ||
        pointer.countryContinent.toLowerCase().startsWith(filter) ||
        pointer.countryCca3.toLowerCase().startsWith(filter)
      ) {
        pointer.filterByName = false;
      } else {
        pointer.filterByName = true;
      }
    });
  });
}

function filterCountriesByPopulation() {
  populationFilterLessThan.addEventListener("input", (input) => {
    const filter = Number(input.target.value) * 1000000;

    const countryNames = dropdownContent.querySelectorAll(".dropdown__element");
    const mapPointers = mapContainer.querySelectorAll(".map_pointer_container");

    filterList(filter, countryNames, "Population", "Less");
    filterList(filter, mapPointers, "Population", "Less");
  });

  populationFilterMoreThan.addEventListener("input", (input) => {
    const filter = Number(input.target.value) * 1000000;

    const countryNames = dropdownContent.querySelectorAll(".dropdown__element");
    const mapPointers = mapContainer.querySelectorAll(".map_pointer_container");

    filterList(filter, countryNames, "Population", "More");
    filterList(filter, mapPointers, "Population", "More");
  });
}

function filterCountriesByArea() {
  areaFilterLessThan.addEventListener("input", (input) => {
    const filter = Number(input.target.value) * 1000;

    const countryNames = dropdownContent.querySelectorAll(".dropdown__element");
    const mapPointers = mapContainer.querySelectorAll(".map_pointer_container");

    filterList(filter, countryNames, "Area", "Less");
    filterList(filter, mapPointers, "Area", "Less");
  });

  areaFilterMoreThan.addEventListener("input", (input) => {
    const filter = Number(input.target.value) * 1000;

    const countryNames = dropdownContent.querySelectorAll(".dropdown__element");
    const mapPointers = mapContainer.querySelectorAll(".map_pointer_container");

    filterList(filter, countryNames, "Area", "More");
    filterList(filter, mapPointers, "Area", "More");
  });
}

function filterList(filter, list, by, sortMode) {
  list.forEach((el) => {
    switch (sortMode) {
      case "More":
        Number(el[`country${by}`]) <= filter
          ? (el[`filterBy${sortMode + by}`] = true)
          : (el[`filterBy${sortMode + by}`] = false);
        break;
      case "Less":
        Number(el[`country${by}`]) >= filter
          ? (el[`filterBy${sortMode + by}`] = true)
          : (el[`filterBy${sortMode + by}`] = false);
        break;
      default:
        break;
    }
  });
}

function slider() {
  const populationFromSlider = document.querySelector(
    "#population-from-slider"
  );
  const populationToSlider = document.querySelector("#population-to-slider");
  const populationFromInput = document.querySelector("#population-less-than");
  const populationToInput = document.querySelector("#population-more-than");
  fillSlider(
    populationFromSlider,
    populationToSlider,
    "#C6C6C6",
    "#25daa5",
    populationToSlider
  );
  setToggleAccessible(populationToSlider, populationToSlider);

  populationFromSlider.oninput = () =>
    controlFromSlider(
      populationFromSlider,
      populationToSlider,
      populationFromInput
    );
  populationToSlider.oninput = () =>
    controlToSlider(
      populationFromSlider,
      populationToSlider,
      populationToInput
    );
  populationFromInput.oninput = () =>
    controlFromInput(
      populationFromSlider,
      populationFromInput,
      populationToInput,
      populationToSlider
    );
  populationToInput.oninput = () =>
    controlToInput(
      populationToSlider,
      populationFromInput,
      populationToInput,
      populationToSlider
    );

  const areaFromSlider = document.querySelector("#area-from-slider");
  const areaToSlider = document.querySelector("#area-to-slider");
  const areaFromInput = document.querySelector("#area-less-than");
  const areaToInput = document.querySelector("#area-more-than");
  fillSlider(areaFromSlider, areaToSlider, "#C6C6C6", "#25daa5", areaToSlider);
  setToggleAccessible(areaToSlider, areaToSlider);

  areaFromSlider.oninput = () =>
    controlFromSlider(areaFromSlider, areaToSlider, areaFromInput);
  areaToSlider.oninput = () =>
    controlToSlider(areaFromSlider, areaToSlider, areaToInput);
  areaFromInput.oninput = () =>
    controlFromInput(areaFromSlider, areaFromInput, areaToInput, areaToSlider);
  areaToInput.oninput = () =>
    controlToInput(areaToSlider, areaFromInput, areaToInput, areaToSlider);
}

function createCountryName(country) {
  createNode(
    "a",
    {
      id: country.cca3,
      className: "dropdown__element",
      innerText: country.name.common,
      countryCapital: country.capital ? country.capital[0] : "",
      countryContinent: country.region,
      countryCca3: country.cca3,
      countryPopulation: country.population,
      countryArea: country.area,
      filterByName: false,
      filterByLessPopulation: false,
      filterByMorePopulation: false,
      filterByLessArea: false,
      filterByMoreArea: false,
    },
    dropdownContent
  );
  const searchBarCountryName = dropdownContent.querySelector(
    `#${country.cca3}`
  );
  searchBarCountryName.addEventListener("click", () => {
    showOnMap(country);
    createCountryDetails(country, body);
    searchBar.placeholder = country.name.common;
  });
}

function createPointer(country) {
  const geoInfo = country.latlng;
  const lat = (Math.abs(geoInfo[0] - 90) / 180) * 100;
  const lng = ((geoInfo[1] + 180) / 360) * 100;
  const position = `top: ${lat}%; left: ${lng}%`;

  createNode(
    "div",
    {
      id: country.cca3,
      className: "map_pointer_container",
      countryName: country.name.common,
      countryCapital: country.capital ? country.capital[0] : "",
      countryContinent: country.region,
      countryCca3: country.cca3,
      countryPopulation: country.population,
      countryArea: country.area,
      style: position,
      filterByName: false,
      filterByLessPopulation: false,
      filterByMorePopulation: false,
      filterByLessArea: false,
      filterByMoreArea: false,
    },
    mapContainer,
    [mapPin()]
  );

  const mapPointer = mapContainer.querySelector(`#${country.cca3}`);
  mapPointer.addEventListener("click", () => {
    createCountryDetails(country, body);
  });
}

function createCountryDetails(country, parentNode) {
  const country_detail = document.querySelectorAll(".country_card");
  if (country_detail.length > 0) {
    country_detail.forEach((e) => {
      e.innerHTML = "";
      e.classList = "";
    });
  }

  createNode("div", { className: "country_card" }, parentNode, [
    createNode("div", { className: "flag-container" }, "", [
      createNode("img", {
        className: "flag",
        src: country.flags.svg,
        alt: country.name.common,
      }),
    ]),
    createNode("div", { className: "country_details" }, "", [
      createNode("h1", {
        className: "country_name",
        innerText: country.name.common,
      }),
      country.capital
        ? createNode("p", {
            className: "detail",
            innerText: "Capital: " + country.capital[0],
          })
        : "",
      createNode("p", {
        className: "detail",
        innerText: "Population: " + formatNumber(Number(country.population)),
      }),
      createNode("p", {
        className: "detail",
        innerText:
          "Area: " + formatNumber(Number(country.area)/1000) + " km²",
      }),
    ]),
  ]);
}

function createNode(tagName, attributes = {}, parentNode = "", children = []) {
  const el = document.createElement(tagName);
  for (const key of Object.keys(attributes)) {
    el[key] = attributes[key];
  }
  children.forEach((child) => {
    el.append(child);
  });
  if (parentNode === "") {
    return el;
  }
  parentNode.append(el);
  return null;
}

function formatNumber(number) {
  return number.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    notation: "compact",
    compactDisplay: "long",
  });
}

main();
