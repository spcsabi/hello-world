export default function () {const mapPin = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "svg"
);
mapPin.setAttribute("class", "map_pointer");
mapPin.setAttribute("viewBox", "0 0 100 99.664");
mapPin.setAttribute("x", "0px");
mapPin.setAttribute("y", "0px");
mapPin.setAttribute("fill", "currentColor");
mapPin.setAttribute("xmlns", "http://www.w3.org/2000/svg");
const pathElement = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "path"
);
pathElement.setAttribute(
  "d",
  "M19.74,57.53l.18.26c.22.33.45.65.68,1L46.66,96.23a4.07,4.07,0,0,0,6.68,0l26-37.41c.25-.35.49-.69.73-1l.16-.24h0a36,36,0,1,0-60.47,0ZM50,23.06a15,15,0,1,1-15,15A15,15,0,0,1,50,23.06Z"
);
mapPin.appendChild(pathElement);
return mapPin
}