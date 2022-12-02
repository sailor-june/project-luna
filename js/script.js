const { error } = require("jquery");

////// DO NOT TOUCH this is the api setting for retrieving the phase///////
const settings = {
	"async": true,
	"crossDomain": true,
	"url": `https://moon-api1.p.rapidapi.com/phase?&angle-units=deg`,
	"method": "GET",
	"headers": {
		"X-RapidAPI-Key": "809da0f4bfmsh0a916cb7d3328c3p181fc8jsn420ae096549d",
		"X-RapidAPI-Host": "moon-api1.p.rapidapi.com"
	}
};


//////// this is the API url for all other data

const timeURL = "https://api.ipgeolocation.io/astronomy?apiKey=7b8fc3f3d7674511add28b46a7597b65&location=New%20York,%20US"

///// cached elements //////////////

const $main = $('#main')
const $moonTimes = $('#moonTimes')
const $sunTimes = $('#sunTimes')
const $phaseData = $('#phaseData')
const $btn = $('button')
const $localTime = $('#localTime')
const $moonAge = $('#moonAge')
const $distance = $('#distance')
/////evt listeners////////

$btn.on('click', handleGetData)

//////////////

function handleGetData(){

	function handleGetPhase(){
		$.ajax(settings).then(function (response) {

			if (response){
				console.log(response)
				$phaseData.text(response.phaseName)
				$moonAge.text(Math.floor(response.phaseAge) + ' days since the new moon.')
			}
			else {
				console.log(error)
			}
		});
		
	
	}
	
	
	
	function handleGetTimeData(){
		$.ajax(timeURL).then(function (response) {
			$localTime.text('current time: '+response.current_time)
			$moonTimes.text('moonrise: '+response.moonrise + '  moonset: ' + response.moonset )
			$sunTimes.text('sunrise : '+response.sunrise + ' sunset: ' + response.sunset )
			$distance.text('lunar altitude: ' + Math.floor(response.moon_distance)+'km')
			
			
			let smallTime = (response.current_time.slice(0,5))
			let hour = smallTime.slice(0,2)
			let minute= smallTime.slice(3,5)
			if (parseFloat(response.sunset) > hour){
				$sunTimes.text((parseFloat(response.sunset)-hour) + ' hours  and ' + (parseFloat(response.sunset.slice (3,5))-minute) +' minutes until sunset')
			}
		})
	}
handleGetPhase();
handleGetTimeData();


};