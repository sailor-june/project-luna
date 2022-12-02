////// DO NOT TOUCH this is the api setting for retrieving the phase///////
const settings = {
	async: true,
	crossDomain: true,
	url: `https://moon-api1.p.rapidapi.com/phase?&angle-units=deg`,
	method: "GET",
	headers: {
	  "X-RapidAPI-Key": "809da0f4bfmsh0a916cb7d3328c3p181fc8jsn420ae096549d",
	  "X-RapidAPI-Host": "moon-api1.p.rapidapi.com",
	},
  };
  
  //////// this is the API url for all other data
  
  const timeURL =
	"https://api.ipgeolocation.io/astronomy?apiKey=7b8fc3f3d7674511add28b46a7597b65&location=New%20York,%20US";
  
  ///// cached elements //////////////
  
  const $main = $("#main");
  const $moonTimes = $("#moonTimes");
  const $sunTimes = $("#sunTimes");
  const $phaseData = $("#phaseData");
  const $btn = $("button");
  const $localTime = $("#localTime");
  const $moonAge = $("#moonAge");
  const $distance = $("#distance");
  /////evt listeners////////
  
  $btn.on("click", handleGetData);
  
  //////////////
  
  function handleGetData() {
	function handleGetPhase() {
	  $.ajax(settings).then(function (response) {
		if (response) {
		  console.log(response);
		  $phaseData.text(response.phaseName);
		  $moonAge.text(Math.floor(response.phaseAge) + " days since the new moon.");
		}
	  });
	}
  
	function handleGetTimeData() {
	  $.ajax(timeURL).then(function (response) {
		
		$localTime.text("current time: " + response.current_time);
		$moonTimes.text(
		  "moonrise: " + response.moonrise + "  moonset: " + response.moonset);
		$sunTimes.text(
		  "sunrise : " + response.sunrise + " sunset: " + response.sunset);
		$distance.text(
		  "lunar altitude: " + Math.floor(response.moon_distance) + "km");




		  function toMilis(target) {
			  let hh = parseInt(target.slice(0, 3));
			  let mm = parseInt(target.slice(3, 5));
			  hh = hh * 1000 * 60 * 60;
			  mm = mm * 1000 * 60;
			  let output = hh + mm;
			  return output;
			}

		  function toStandard(target){
			  let minutes = (target/1000)/60
			  let hours = 	Math.floor(minutes/60)
			  minutes = Math.floor((minutes%60)* (60/100))
			  return `${hours} hours and ${minutes} minutes`
		  }
  
		  let miliDay = toMilis("24:00");
		  let miliLocal = toMilis(response.current_time);
		  let miliMoonset = toMilis(response.moonset);
		  let miliMoonrise = toMilis(response.moonrise);
		  let miliSunset = toMilis(response.sunset);
		  let miliSunrise = toMilis(response.sunrise);
		  let sunMessage = "";
		  let moonMessage = "";
		  
		 
		 
		 
			if (miliLocal > miliSunset) {
			sunMessage =  " time until sunrise = " + toStandard((miliDay - miliLocal) + miliSunrise);
		  } else if (miliLocal < miliSunset && miliLocal > miliSunrise) {
			sunMessage = "time until sunset = " +toStandard((miliSunset - miliLocal));
		  } else if (miliLocal < miliSunrise) {
			sunMessage = "time until sunrise = " + toStandard((miliSunrise - miliLocal));
		  }
		  $sunTimes.text(sunMessage);
		
			if (miliMoonrise < miliMoonset){
				console.log('alpha')
				if (miliLocal < miliMoonrise) {
					moonMessage = "time until moonrise: " + toStandard(miliMoonrise-miliLocal)
			} 	else if (miliLocal > miliMoonrise && miliLocal < miliMoonset){
					moonMessage = "time until moonset: "+ toStandard(miliMoonset - miliLocal)
			}
				else if (miliLocal > miliMoonset){
					moonMessage = "time until moonrise: " + (toStandard(miliDay - miliLocal)+miliMoonrise)
			}
			$moonTimes.text = moonMessage  
			}
			else if (miliMoonset < miliMoonrise){
				console.log('beta')
				if (miliLocal < miliMoonset){
					moonMessage = "time until moonset: "+ toStandard(miliMoonset - miliLocal)
				}
				else if (miliLocal > miliMoonset && miliLocal < miliMoonrise){
					moonMessage = "time until moonrise: "+ toStandard(miliMoonset - miliLocal)
				}
				else if (miliLocal>miliMoonrise){
					moonMessage="time until moonset: "+toStandard((miliDay - miliLocal) + miliMoonset )
				}
				$moonTimes.text(moonMessage)  
			}
		 
		})
	}
	  
	  
	
	
	
	handleGetPhase();
	handleGetTimeData();
  }
  