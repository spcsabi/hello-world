import countries from "./data.js";
import mapPin from "./assets/mapPin.js";
let countriesFiltered = countries;

const body = document.querySelector("body");

const searchBar = document.querySelector("#search-bar");
const filterByPopulation = document.querySelector("#filter-by-population");
const filterByArea = document.querySelector("#filter-by-area");

const dropdownContent = document.querySelector("#dropdown-content");

const mapContainer = document.querySelector("#map_container");

function main() {
  countriesFiltered.forEach((country) => {
    createPointer(country);
    createCountryName(country);
  });
  showDropdown();
  filterCountriesBySearchBar();
  onClose();
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

function filterCountriesBySearchBar() {
  searchBar.addEventListener("input", (input) => {
    const filter = input.target.value.toUpperCase();
    const countryNames = dropdownContent.querySelectorAll(".dropdown__element");
    countryNames.forEach((countryName) => {
      const txtValue = countryName.textContent || countryName.innerText;
      const countryCapital = countryName.countryCapital;
      const countryContinent = countryName.countryContinent;
      const countryCca3 = countryName.countryCca3;

      if (
        txtValue.toUpperCase().indexOf(filter) > -1 ||
        countryCapital.toUpperCase().startsWith(filter) ||
        countryContinent.toUpperCase().startsWith(filter) ||
        countryCca3.toUpperCase().startsWith(filter)
      ) {
        countryName.style.display = "";
      } else {
        countryName.style.display = "none";
      }
    });
    const mapPointers = mapContainer.querySelectorAll(".map_pointer_container");
    mapPointers.forEach((pointer) => {
      const countryName = pointer.countryName;
      const countryCapital = pointer.countryCapital;
      const countryContinent = pointer.countryContinent;
      const countryCca3 = pointer.countryCca3;

      if (
        countryName.toUpperCase().indexOf(filter) > -1 ||
        countryCapital.toUpperCase().startsWith(filter) ||
        countryContinent.toUpperCase().startsWith(filter) ||
        countryCca3.toUpperCase().startsWith(filter)
      ) {
        pointer.style.display = "";
      } else {
        pointer.style.display = "none";
      }
    });
  });
}

function filterCountriesByPopulation() {
  filterByPopulation.addEventListener("input", (input) => {
    const filter = input.target.value();

    const mapPointers = mapContainer.querySelectorAll(".map_pointer_container");
    mapPointers.forEach((pointer) => {
      const countryName = pointer.countryName;
      const countryCapital = pointer.countryCapital;
      const countryContinent = pointer.countryContinent;

      // countryCca3: country.cca3,
      // countryPopulation: country.population,
      // countryArea:country.area,

      if (
        countryName.toUpperCase().indexOf(filter) > -1 ||
        countryCapital.toUpperCase().indexOf(filter) > -1 ||
        countryContinent.toUpperCase().indexOf(filter) > -1
      ) {
        pointer.style.display = "";
      } else {
        pointer.style.display = "none";
      }
    });
  });
}

function onClose() {
  let lastEvent = null;
  window.addEventListener("click", (event) => {
    if (
      !event.target.matches(".search-bar__input") &&
      !event.target.matches(".map_pointer")
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
      !lastEvent.target.matches(".search-bar__input") &&
      !event.target.matches(".search-bar__input") &&
      !event.target.matches(".country_card") &&
      !event.target.matches("path") &&
      !event.target.matches(".map_pointer") &&
      !event.target.matches(".map_pointer_containter")
    ) {
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
        innerText: "Area: " + country.area + "m²",
      }),
      createNode("p", {
        className: "detail",
        innerText: "Population: " + country.population,
      }),
      ...country.timezones.map((timezone) =>
        createNode("p", {
          className: "detail",
          innerText: timezone + " ",
        })
      ),
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

main();
