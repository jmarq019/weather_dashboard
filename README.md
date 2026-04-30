# weather_dashboard
## Description
This project had the objective of learning to work with API calls and displaying the results on the page. The OpenWeather API was used to build a weather dashboard that displays the current weather and a five-day forecast for a city provided by the user as a search query. Through this project, I learned how to interpret data from the OpenWeather API and how to manipulate and display it on the page. The project was originally built using jQuery and the Materialize CSS library for styling.

The application was later redesigned through Claude Design into a modern React-based application. The redesign introduced a glassmorphic UI with dark and light theme support, an hourly forecast panel, air quality index, UV index, a wind rose, a recent searches list, and a tweaks panel for user customization. The deployment was also updated to use Vercel with a secure environment variable build step for the API key.
## Table of Contents 
- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
## Installation
The page can be accessed through [this link](https://weather-dashboard-rust-eight.vercel.app/).
## Usage
The user types the name of a city into the search bar and the weather information is displyed. The searches get saved as a list of clickable buttons. They can be clicked to display the corresponding weather information. These past search information is saved in the browser's local sotrage.

![a screenshot of my page](./assets/images/screenshot.png)

## Credits
Credits to the lessons taught by the UW coding bootcamp TAs, instructor, and tutors. Credits also go to the OpenWeather API documentation, the Moment.js library documentation, and the Materialize library documentation. The modern redesign was completed with the assistance of Claude Design by Anthropic.
## Tests
Testing was done directly on the page.