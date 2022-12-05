const link =
"http://api.weatherstack.com/current?access_key=73ef639e4b5ebe7bc7ed04e80bb960e3";

const root = document.getElementById('root')
const popup = document.getElementById('popup')
const textInput = document.getElementById('text-input')
const form = document.getElementById('form')

let store = {
    city: "New York",
    feelslike:0,
    temperature:0,    
    observationTime:'00:00 AM',
    isDay:'yes',
    description:'',  
    properties:{
      cloudcover:{},
      humidity:{},
      windSpeed:{},
      visibility:{},
      pressure:{},
      uvIndex:{},
    }
}
const fetchData = async () => {
  try{
    const query = localStorage.getItem('query') || store.city
    const result = await fetch(`${link}&query=${query}`);
    const data = await result.json();

    const { 
        current:{
            feelslike,
            cloudcover,
            humidity, 
            temperature,
            observation_time:observationTime,
            pressure,
            uv_index:uvIndex,
            visibility,
            is_day: isDay,
            weather_description:description,
            wind_speed: windSpeed
        }, 
        location:{
          name
        }
} = data


    store = {
        ...store,
        city:name,
        //Чтобы не писать два раза:
        feelslike,
        temperature,
        observationTime,      
        isDay,
        description:description[0],        
        properties:{
          //разбиваем еще, чтобы получить картинку
          cloudcover: {
            title: 'cloud cover',
            value: `${cloudcover}%`,
            icon: 'cloud.png'
          },
          humidity: {
            title:'humidity',
            value: `${humidity}%`,
            icon: 'humidity.png'
          },
          windSpeed: {
            title:'wind speed',
            value: `${windSpeed} km/h`,
            icon: 'wind.png'
          },
          visibility: {
            title:'visibility',
            value: `${visibility} km/h`,
            icon: 'visibility.png'
          },
          pressure:{
            title:'pressure',
            value: `${pressure} km/h`,
            icon: 'gauge.png'
          },
          uvIndex:{
            title:'uv index',
            value: `${uvIndex} / 100`,
            icon: 'uv-index.png'
          }
        }
        
    }

    renderComponent()
  } catch(err) {
    console.log(err)
  }
 
}

const getImage = (description) =>{
    if (description === 'Overcast') return ''
    const value = description.toLowerCase()
    switch(value){
      case 'partly cloudy':
          return 'partly.png';
      case 'cloud':
          return 'cloud.png'
      case 'fog':
          return 'fog.png'
      case 'sunny':
          return 'sunny.png'
      default:
          return 'the.png'
    }
}

const renderProperty = (properties) => {
  return Object.values(properties).map(({title, value, icon}) => {
   return `<div class="property">
    <div class="property-icon">
      <img src="./img/icons/${icon}" alt="">
    </div>
    <div class="property-info">
      <div class="property-info__value">${value}</div>
      <div class="property-info__description">${title}</div>
    </div>
  </div>`;
  }).join('')
  
  }
  
const markup = () => {
    const{
        city,
        description,
        observationTime,
        temperature,
        isDay

    } = store

    const containerClass = isDay === 'yes' ? 'is-day' : ''
     
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
                <div class="city-info__subtitle">as of ${observationTime}</div>
                <div class="city-info__title">${temperature}°</div>
              </div>
            </div>
          </div>
        <div id="properties">${renderProperty(properties)}</div>
      </div>`;
}

const togglePopupClass = () =>{
  popup.classList.toggle('active')
}

const renderComponent = () => {
    root.innerHTML = markup()
    const city = document.getElementById('city')
    city.addEventListener('click', handleClick)
}

const handleInput = (e) => {
  store = {
    ...store,
    city: e.target.value,
  }
}

const handleSubmit = (e) => {
  e.preventDefault()
  const value = store.city

  if(!value) return null
  localStorage.setItem('query', value)
  fetchData()
  togglePopupClass()
}

form.addEventListener('submit', handleSubmit )
textInput.addEventListener('input', handleInput)

fetchData()