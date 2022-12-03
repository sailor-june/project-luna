///// cached elements //////////////

const $main = $("#main");
const $input = $("#input");
const $moonTimes = $("#moonTimes");
const $sunTimes = $("#sunTimes");
const $phaseData = $("#phaseData");
const $btn = $("button");
const $localTime = $("#localTime");
const $moonAge = $("#moonAge");
const $distance = $("#distance");
const $queryLoc = $('#queryLocation')
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
		  $queryLoc.text(response.resolvedAddress)
          console.log(response);
          let phase = response.currentConditions.moonphase;
          if (phase === 0) {
            phase = "new moon";
          } else if (phase < 0.25) {
            phase = "waxing crescent";
          } else if (phase === 0.25) {
            phase = "first quarter";
          } else if (phase < 0.5) {
            phase = "waxing gibbous";
          } else if (phase === 0.5) {
            phase = "full moon";
          } else if (phase < 0.75) {
            phase = "waning gibbous";
          } else if (phase === 0.75) {
            phase = "last quarter";
          } else if (phase < 1) {
            phase = "waning crescent";
          } else if (phase === 1) {
            phase = "new moon";
          }
          for (let i = 0; i < response.days.length; i++) {
			if (response.days[i].moonphase === 0.5) {
              let fullDay = i;
              $moonAge.text(fullDay + " days until the full moon.");
              break;
            } else if (
              response.days[i].moonphase === 0 ||
              response.days[i].moonphase === 1
            ) {
              let fullDay = i;
              $moonAge.text(fullDay + " days until the new moon.");
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
        $localTime.text("current time: " + response.current_time);
        $distance.text(
          "lunar altitude: " + Math.floor(response.moon_distance) + "km"
        );

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

        let miliDay = toMilis("24:00");
        let miliLocal = toMilis(response.current_time);
        let miliMoonset = toMilis(response.moonset);
        let miliMoonrise = toMilis(response.moonrise);
        let miliSunset = toMilis(response.sunset);
        let miliSunrise = toMilis(response.sunrise);
        let sunMessage = "";
        let moonMessage = "";

        if (miliLocal > miliSunset) {
          sunMessage =
            " time until sunrise : " +
            toStandard(miliDay - miliLocal + miliSunrise);
        } else if (miliLocal < miliSunset && miliLocal > miliSunrise) {
          sunMessage =
            "time until sunset : " + toStandard(miliSunset - miliLocal);
        } else if (miliLocal < miliSunrise) {
          sunMessage =
            "time until sunrise : " + toStandard(miliSunrise - miliLocal);
        }
        $sunTimes.text(sunMessage);

        if (miliMoonrise < miliMoonset) {
          console.log("alpha");
          if (miliLocal < miliMoonrise) {
            moonMessage =
              "time until moonrise : " + toStandard(miliMoonrise - miliLocal);
          } else if (miliLocal > miliMoonrise && miliLocal < miliMoonset) {
            moonMessage =
              "time until moonset : " + toStandard(miliMoonset - miliLocal);
          } else if (miliLocal > miliMoonset) {
            moonMessage =
              "time until moonrise : " +
              (toStandard(miliDay - miliLocal) + miliMoonrise);
          }
          $moonTimes.text = moonMessage;
        } else if (miliMoonset < miliMoonrise) {
          console.log("beta");
          if (miliLocal < miliMoonset) {
            moonMessage =
              "time until moonset : " + toStandard(miliMoonset - miliLocal);
          } else if (miliLocal > miliMoonset && miliLocal < miliMoonrise) {
            moonMessage =
              "time until moonrise : " + toStandard(miliMoonrise - miliLocal);
          } else if (miliLocal > miliMoonrise && miliLocal > miliMoonset) {
            moonMessage =
              "time until moonset : " +
              toStandard(miliDay - miliLocal + miliMoonset);
          }
          $moonTimes.text(moonMessage);
        }
      });
    }
  }

  handleGetPhase();
  handleGetTimeData();
}
