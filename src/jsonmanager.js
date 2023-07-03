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
    $.ajax({
      url: "https://feed.entertainment.tv.theplatform.eu/f/PR1GhC/mediaset-prod-all-programs-v2?byCustomValue={subBrandId}{9910595|9890596|9900597}&sort=mediasetprogram$publishInfo_lastPublished|desc&range=1-25&20230703152711",
      dataType: "json",
      success: function (data) {
        const imageContainer = document.getElementById('image-container');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const slidesToShow = 4;
        let currentIndex = 0;
        
        function showSlides() {
          const slides = document.getElementsByClassName('slider');
          const totalSlides = slides.length;
          
          for (let i = 0; i < totalSlides; i++) {
            slides[i].style.display = 'none';
          }
          
          for (let i = 0; i < slidesToShow; i++) {
            const index = (currentIndex + i) % totalSlides;
            slides[index].style.display = 'block';
          }
        }
        
        for (let i = 0; i < data.entries.length; i++) {
          let imgUrl = data.entries[i].thumbnails['image_vertical-192x288'].url;
          let videoUrl = data.entries[i].media[0].publicUrl;
          let title = data.entries[i].title;
          
          const slide = document.createElement('div');
          slide.className = "slider";
          
          const img = document.createElement('img');
          img.src = imgUrl;
          
          const ptitle = document.createElement('p');
          ptitle.innerHTML = title;
          
          slide.appendChild(img);
          slide.appendChild(ptitle);
          
          imageContainer.appendChild(slide);
        }
        
        const slides = document.getElementsByClassName('slider');
        if (slides.length > 0) {
          slides[0].style.display = 'block';
        }
        
        prevBtn.addEventListener('click', function () {
          currentIndex--;
          
          if (currentIndex < 0) {
            currentIndex = slides.length - 1;
          }
          
          showSlides();
        });
        
        nextBtn.addEventListener('click', function () {
          currentIndex++;
          
          if (currentIndex >= slides.length) {
            currentIndex = 0;
          }
          
          showSlides();
        });
        
        showSlides();
        
        setInterval(function () {
          currentIndex++;
          
          if (currentIndex >= slides.length) {
            currentIndex = 0;
          }
          
          showSlides();
        }, 10000000);
      },
    });
  }
  
    

  
}
