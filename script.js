const link =
"http://api.weatherapi.com/v1/current.json?key=e65ef7e4e4794414814180138220712";

const root = document.getElementById("root");
const popup = document.getElementById("popup");
const textInput = document.getElementById("text-input");
const form = document.getElementById("form");
const cancel = document.getElementById('close')


let store = {
  city: "Minsk",
  temp_c: 0,
  localtime: "00:00",
  is_day: 1,
  text: "",
  country:'Russia',
  region:'Sverdlovsk',
  properties: {
    cloud: {},
    humidity: {},
    wind_kph: {},
    pressure_mb: {},
    uv: {},
    vis_km: {},
    feelslike_c:{},
    wind_dir:{}
  },
};

const fetchData = async () => {
  try {
    const query = localStorage.getItem("query") || store.city;
    const result = await fetch(`${link}&q=${query}`);
    const data = await result.json();
    console.log(data)

    const {
      current: {
        cloud,
        temp_c:temperature,
        humidity,
        pressure_mb: pressure,
        uv,
        vis_km: visibility,
        is_day: isDay,
        wind_kph: windSpeed,
        feelslike_c: feelsLike,
        wind_dir: windDirection,

      condition:{
        text:description
      }
    },
      location: { 
        name, 
        localtime: time,
        country,
        region
      }
    } = data;

    

    store = {
      ...store,
      isDay,
      city: name,
      temperature,
      time,
      description,
      country,
      region,
      properties: {
        cloud: {
          title: "cloud cover",
          value: `${cloud}%`,
          icon: "cloud.png",
        },
        humidity: {
          title: "humidity",
          value: `${humidity}%`,
          icon: "humidity.png",
        },
        windSpeed: {
          title: "wind speed",
          value: `${windSpeed} km/h`,
          icon: "wind.png",
        },
        pressure: {
          title: "pressure",
          value: `${pressure} %`,
          icon: "gauge.png",
        },
        uv: {
          title: "uv Index",
          value: `${uv} / 100`,
          icon: "uv-index.png",
        },
        visibility: {
          title: "visibility",
          value: `${visibility} km`,
          icon: "visibility.png",
        },
        feelsLike: {
          title: "feels like",
          value: `${feelsLike} °`,
          icon: "feels-like.png"
        },
        windDirection: {
          title: "wind direction",
          value: windDirection,
          icon: "wind-direction.png"
        }    
      },
    };

    renderComponent();
  } catch (err) {
    console.log(err);
  }
};

const getImage = (description) => {
  const value = description.toLowerCase();

  switch (value) {
    case "partly cloudy":
      return "partly.png";
    case "clear":
      return "clear.png";
    case "mist":
      return "fog.png";
    case "sunny":
      return "sunny.png";
    case "cloud":
      return "cloud.png";
    case 'light rain shower':
      return 'light-rain-shower.png';
    case 'overcast':
      return 'overcast.png'
    case 'light rain':
      return 'light-rain.png'
    case 'light drizzle':
      return 'light-drizzle.png'
    case 'light snow':
      return 'light-snow.png'
    default:
      return "the.png";
  }
};

const renderProperty = (properties) => {
  return Object.values(properties)
    .map(({ title, value, icon }) => {
      return `<div class="property">
            <div class="property-icon">
              <img src="./img/icons/${icon}" alt="">
            </div>
            <div class="property-info">
              <div class="property-info__value">${value}</div>
              <div class="property-info__description">${title}</div>
            </div>
          </div>`;
    })
    .join("");
};

const markup = () => {
  const { city, description, time, temperature, isDay, properties, country, region } =
    store;

  const containerClass = isDay === 1 ? "is-day" : "";
  const bgColor = isDay === 1 ? 'is-day' : '';


  return `<div class="container ${containerClass}">
            <div class="top">
              <div class="city">
                <div class="city-subtitle">Weather Today in</div>
                  <div class="city-title" id="city">
                  <span>${city}</span>
                </div>
              </div>
              <div class="city-info">
                <div class="top-left">
                <img class="icon" src="./img/${getImage(description)}" alt="" />
                <div class="description">${description}</div>
              </div>
            
              <div class="top-right">
                <div class="city-info__country">${country}</div>
                <div class="city-info__region">${region}</div>
                <div class="city-info__subtitle">as of ${time}</div>
                <div class="city-info__title">${temperature}°</div>
              </div>
            </div>
          </div>
        <div id="properties">${renderProperty(properties)}</div>
      </div>`;

      
};


const togglePopupClass = () => {
  popup.classList.toggle("active");
};

const renderComponent = () => {
  root.innerHTML = markup();

  const city = document.getElementById("city");
  city.addEventListener("click", togglePopupClass);
};

const handleInput = (e) => {
  store = {
    ...store,
    city: e.target.value
  };
};

const handleSubmit = (e) => {
  e.preventDefault();
  const value = store.city;

  if (!value) return null;

  localStorage.setItem("query", value);
  fetchData();
  togglePopupClass();
};


form.addEventListener("submit", handleSubmit);
textInput.addEventListener("input", handleInput);
cancel.addEventListener('click', togglePopupClass)


fetchData();