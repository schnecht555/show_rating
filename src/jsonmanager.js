export class jsonmanager {
  loadJson() {
    let promise = new Promise(function (resolve, reject) {
      const urlParams = new URLSearchParams(window.location.search);
      let id = urlParams.get("ID");
      if (!id) {
        id = "111";
        urlParams.set("ID", id);
        const newUrl = window.location.pathname + "?" + urlParams.toString();
        window.history.replaceState(null, null, newUrl);
      }

      $.ajax({
        url: "https://enabler.finconsgroup.com/php/rating-app/rating.json",
        dataType: "json",
        success: function (data) {
          const result = data[id];
          if (result) {
            const title = result.Title;
            const desc = result.Description;
            const bkgimgurl = result.BkgImage;
            resolve({ Title: title, Desc: desc, URLImg: bkgimgurl });
          } else {
            console.log("No OBJ with ID");
            reject(new Error("Something is not right!"));
          }
        },
      });
    });

    return promise;
  }
  getArray() {
    var jsonString = localStorage.getItem("rating");
    var array = JSON.parse(jsonString);
    return array;
  }

  setArray(arrayInput) {
    var jsonString = JSON.stringify(arrayInput);
    localStorage.setItem("rating", jsonString);
  }
  loadCarousel() {
    let arrayVideo = [];

    let promise = new Promise(function (resolve, reject) {
      $.ajax({
        url: "https://feed.entertainment.tv.theplatform.eu/f/PR1GhC/mediaset-prod-all-programs-v2?byCustomValue={subBrandId}{9910595|9890596|9900597}&sort=mediasetprogram$publishInfo_lastPublished|desc&range=1-25&20230703152711",
        dataType: "json",
        success: function (data) {
          for (let i = 0; i < data.entries.length; i++) {
            let imgUrl =
              data.entries[i].thumbnails["image_vertical-192x288"].url;
            let videoUrl = data.entries[i].media[0].publicUrl;
            let title = data.entries[i].title;
            arrayVideo.push({
              title: title,
              videoUrl: videoUrl,
              imgUrl: imgUrl,
            });
          }
          resolve(arrayVideo);
        },
      });
    });

    return promise;
  }

  loadDownWardsCarousel() {
    let arrayNews = [];

    let promise = new Promise(function (resolve, reject) {
      $.ajax({
        /*"https://api.thenewsapi.com/v1/news/top?api_token=Ng6EtG7SOAUn5YS4JHZPDhB9WZI1qXU6aT2DHEM7&locale=us&limit=3&page=1" */
        url: "https://enabler.finconsgroup.com/php/rating-app/news.json",
        dataType: "json",
        success: function (data) {
          for (let i = 0; i < data.data.length; i++) {
            let image_url = data.data[i].image_url;
            let newsTitle = data.data[i].title;
            let newsDesc = data.data[i].description;
            arrayNews.push({
              title: newsTitle,
              description: newsDesc,
              image_url: image_url,
            });
          }
          resolve(arrayNews);
          console.log(arrayNews);
        },
      });
    });

    return promise;
  }

   loadChannelCarousel() {
    return new Promise(function (resolve, reject) {
      fetch("http://static3.mediasetplay.mediaset.it/apigw/nownext/nownext.json")
        .then(response => response.json())
        .then(data => {
          const listings = data.response.listings;
          const stations = data.response.stations; 
          const entries = [];
  
          function getStationTitle(callSign, stations) {
            for (const stationId in stations) {
              const station = stations[stationId];
              if (station.callSign === callSign) {
                return station.title;
              }
            }
            return "";
          }
  
          for (const listeningName in listings) {
            const currentListing = listings[listeningName].currentListing;
            const nextListing = listings[listeningName].nextListing;
            const callSign = listeningName;
            
            // Get the station title using the callSign
            const listeningStation = getStationTitle(callSign, stations);
  
            const currentTitle = currentListing?.program?.title || "";
            const nextTitle = nextListing?.program?.title || "";
            const currentStartTime = currentListing?.startTime;
            const currentEndTime = currentListing?.endTime;
            const nextStartTime = nextListing?.startTime;
            const nextEndTime = nextListing?.endTime;
  
            // Function to format the timestamp into hh:mm format
            function formatTime(timestamp) {
              const date = new Date(timestamp);
              const hours = date.getHours().toString().padStart(2, "0");
              const minutes = date.getMinutes().toString().padStart(2, "0");
              return `${hours}:${minutes}`;
            }
  
            const formattedCurrentStartTime = currentStartTime ? formatTime(currentStartTime) : "";
            const formattedCurrentEndTime = currentEndTime ? formatTime(currentEndTime) : "";
            const formattedNextStartTime = nextStartTime ? formatTime(nextStartTime) : "";
            const formattedNextEndTime = nextEndTime ? formatTime(nextEndTime) : "";
  
            const currentTitleWithTime = `${listeningStation} (${formattedCurrentStartTime} - ${formattedCurrentEndTime})`;
            const nextTitleWithTime = `${listeningStation} (${formattedNextStartTime} - ${formattedNextEndTime})`;
            entries.push({
              listeningName: listeningStation,
              currentTitle: currentTitleWithTime,
              nextTitle: nextTitleWithTime
            });
          }
  
          resolve(entries);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  
  
  
  
}
