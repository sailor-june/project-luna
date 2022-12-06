///// cached elements //////////////

const $main = $("#main");
const $input = $("#input");
const $moonTimes = $("#moonTimes");
const $sunTimes = $("#sunTimes");
const $phaseData = $("#phaseData");
const $btn = $("#btn");
const $localTime = $("#localTime");
const $moonAge = $("#moonAge");
const $distance = $("#distance");
const $queryLoc = $("#queryLocation")
const $date = $('#date')
const $thesun = $('#thesun')
const $themoon = $('#themoon')
/////evt listeners////////

$btn.on("click", handleGetData);

//////////////

function handleGetData() {
  let userlocation = $input.val();
  $input.val("");
  let formatLocation = userlocation.replaceAll(" ", "%20");

  ////////// this is the phase data api URL
  let phaseURL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${formatLocation}?key=L68MCR9UJUVED9GMGL8UXUUYW&elements=moonphase`;
  //////// this is the API url for all other data

  let timeURL = `https://api.ipgeolocation.io/astronomy?apiKey=7b8fc3f3d7674511add28b46a7597b65&location=${formatLocation}`;

  if (formatLocation !== "") {
    function handleGetPhase() {
      $.ajax(phaseURL).then(function (response) {
        if (response) {
          
      
        /////////////converting phase number to string////////////////////
      
          $queryLoc.text(response.resolvedAddress)
          console.log(response);
          let phase = response.currentConditions.moonphase;
          if (phase === 0) {
            phase = "new moon";
            $themoon.addClass('newm')
          } else if (phase < 0.25) {
            phase = "waxing crescent";
            $themoon.addClass("waxc")
          } else if (phase === 0.25) {
            phase = "first quarter";
            $themoon.addClass('firstq')
          } else if (phase < 0.5) {
            phase = "waxing gibbous";
            $themoon.addClass('waxg')
          } else if (phase === 0.5) {
            phase = "full moon";
            $themoon.addClass('fullm')
          } else if (phase < 0.75) {
            phase = "waning gibbous";
            $themoon.addClass('waneg')
          } else if (phase === 0.75) {
            phase = "last quarter";
            $themoon.addClass('lastq')
          } else if (phase < 1) {
            phase = "waning crescent";
            $themoon.addClass('wanec')
          } else if (phase === 1) {
            phase = "new moon";
            $themoon.addClass('newm')
          }
          //////calculating time until next event/////////
          for (let i = 0; i < response.days.length; i++) {
            let phaseNum = response.days[i].moonphase
            if (phaseNum === 0.25){
              $moonAge.text(`${i}  days until first quarter.`)
              break;
            } 
			      else if (phaseNum === 0.5) {
              $moonAge.text(i+ " days until the full moon.");
              break;
            }
            else if (phaseNum === 0.75){
              $moonAge.text(i + " days until last quarter.")
            } 
            else if (phaseNum === 0 ||phaseNum === 1){
              let fullDay = i;
              $moonAge.text(i + " days until the new moon.");
              break;
            }
          }






          $phaseData.text(phase);
          //$moonAge.text(Math.floor(response.phaseAcuge) + " days since the new moon.");
        }
      });
    }

    function handleGetTimeData() {
      $.ajax(timeURL).then(function (response) {
        console.log(response);
        $date.text(response.date)
        $localTime.text("current time: " + response.current_time);
        $distance.text(
          "lunar altitude: " + Math.floor(response.moon_distance) + "km"
        );

        ///////ms conversion functions///////
        function toMilis(target) {
          let hh = parseInt(target.slice(0, 3));
          let mm = parseInt(target.slice(3, 5));
          hh = hh * 1000 * 60 * 60;
          mm = mm * 1000 * 60;
          let output = hh + mm;
          return output;
        }
        function toStandard(target) {
          let minutes = target / 1000 / 60;
          let hours = Math.floor(minutes / 60);
          minutes = Math.floor((minutes % 60) * (60 / 100));
          return `${hours} hours and ${minutes} minutes`;
        }
        ////////storing all time data as miliseconds /////////////////
        let miliDay = toMilis("24:00");
        let miliLocal = toMilis(response.current_time);
        let miliMoonset = toMilis(response.moonset);
        let miliMoonrise = toMilis(response.moonrise);
        let miliSunset = toMilis(response.sunset);
        let miliSunrise = toMilis(response.sunrise);
        let sunMessage = "";
        let moonMessage = "";




        ////////////////// displaying sun times //////////
        if (miliLocal > miliSunset) {
          sunMessage =
            "The sun will rise in " +
            toStandard(miliDay - miliLocal + miliSunrise);
        } else if (miliLocal < miliSunset && miliLocal > miliSunrise) {
          sunMessage =
            "The sun will set in " + toStandard(miliSunset - miliLocal);
        } else if (miliLocal < miliSunrise) {
          sunMessage =
            "The sun will rise in " + toStandard(miliSunrise - miliLocal);
        }
        $sunTimes.text(sunMessage);

        ////////////// sun graphic toggle ////////////
        if (miliLocal > miliSunrise){
          $thesun.addClass('sunout')
          $thesun.removeClass('invisible')
        }
        if (miliLocal > miliSunset){
          $thesun.removeClass('sunout')
          $thesun.addClass('invisible')
        }

        //////////////  //////////  ////////////
        ///if the moon sets before midnight: //
      
        if (miliMoonrise < miliMoonset) {
          
          if (miliLocal < miliMoonrise) {
            moonMessage =
              "The moon will rise in " + toStandard(miliMoonrise - miliLocal);
              $themoon.addClass('invisible')
          } else if (miliLocal > miliMoonrise && miliLocal < miliMoonset) {
            moonMessage =
              "The moon will set in" + toStandard(miliMoonset - miliLocal)
              $themoon.removeClass('invisible');
          } else if (miliLocal > miliMoonset) {
            moonMessage =
              "The moon will rise in " +
              toStandard((miliDay - miliLocal) + miliMoonrise);
            $themoon.addClass('invisible')
          }
          $moonTimes.text = moonMessage;
          ////////////////////////////////////
          //if the moon sets after midnight://
        
        } else if (miliMoonset < miliMoonrise) {
          
          if (miliLocal < miliMoonset) {
            moonMessage =
              "The moon will set in " + toStandard(miliMoonset - miliLocal);
              $themoon.removeClass('invisible')
          } else if (miliLocal > miliMoonset && miliLocal < miliMoonrise) {
            moonMessage =
              "The moon will rise in " + toStandard(miliMoonrise - miliLocal);
              $themoon.addClass('invisible')
          } else if (miliLocal > miliMoonrise && miliLocal > miliMoonset) {
            moonMessage =
              "The moon will set in " +
              toStandard((miliDay - miliLocal) + miliMoonset);
              $themoon.removeClass('invisible')
          }
          $moonTimes.text(moonMessage);
        }

        


      });
    }
  }

  handleGetPhase();
  handleGetTimeData();
}
