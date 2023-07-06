import _ from "lodash";
import "./styles.css";
import {
  dashjs,
  MediaPlayer,
} from "./lib/cdn.dashjs.org_latest_dash.all.min.js";
import { engine } from "./engine";
import { jsonmanager } from "./jsonmanager";
function component() {
  const appMan = document.getElementById("appMan");
  let app = appMan.getOwnerApplication(document);
  app.show();
  let selected = 0;
  let mng = new jsonmanager();
  var eng = new engine();
  var Vote = 5;
  eng.init();
  var id = 0;
  var arrayVideo = null;
  let select = 0;
  const video = document.getElementById("vdoPlr");

  mng
    .loadCarousel()
    .then(function (arrayVideoCarousel) {
      arrayVideo = arrayVideoCarousel;
      console.log(arrayVideo);

      const imageContainer = document.getElementById("image-container");
      const prevBtn = document.getElementById("prev-btn");
      const nextBtn = document.getElementById("next-btn");

      const slidesToShow = 4;
      let currentIndex = 0;

      function showSlides() {
        const slides = document.getElementsByClassName("slider");
        const totalSlides = slides.length;

        for (let i = 0; i < totalSlides; i++) {
          slides[i].style.display = "none";
        }

        for (let i = 0; i < slidesToShow; i++) {
          const index = (currentIndex + i) % totalSlides;
          slides[index].style.display = "block";
        }
      }

      for (let i = 0; i < arrayVideo.length; i++) {
        const slide = document.createElement("div");
        slide.className = "slider";

        const img = document.createElement("img");
        img.src = arrayVideo[i].imgUrl;
        img.title = arrayVideo[i].title;
        slide.appendChild(img);

        imageContainer.appendChild(slide);
      }

      const slides = document.getElementsByClassName("slider");
      if (slides.length > 0) {
        slides[0].style.display = "block";
      }

      prevBtn.addEventListener("click", function () {
        currentIndex--;
        selected--;
        if (currentIndex < 0) {
          currentIndex = slides.length - 1;
          selected = slides.length - 1;
        }
        console.log(selected);
        showSlides();
      });

      nextBtn.addEventListener("click", function () {
        currentIndex++;
        selected++;
        if (currentIndex >= slides.length) {
          currentIndex = 0;
          selected = 0;
        }
        console.log(selected);

        showSlides();
      });

      showSlides();

      setInterval(function () {
        currentIndex++;

        if (currentIndex >= slides.length) {
          currentIndex = 0;
        }

        showSlides();
      }, 1000000);
    })
    .catch(function (error) {
      console.log(error);
    });

  mng
    .loadJson()
    .then(function (LJ) {
      $("#showTitle").html("Titolo: " + LJ.Title);
      $("#showDesc").html("Descrizione: " + LJ.Desc);
      $("body").css({ "background-image": "url(" + LJ.URLImg + ")" });
      id = LJ.id;
    })
    .catch(function (error) {
      console.log(error);
    });

  $("#okdiv").click(function () {
    $("#avgVote").show();
    $("#avgVote").html(eng.getAverage(id, Vote).toFixed(2));
  });
  $(document).keydown(function (event) {
    if (event.keyCode === 13) {
      $("#info").hide();
      $("#appMan").hide();
      $("#voteBox").hide();
      $("#tvScreen").hide();
      $(".vdoPlr").show();
      $(".slider-container").hide();
      $("#videoControlls").show();
      var url = arrayVideo[selected].videoUrl;
      var player = MediaPlayer().create();
      player.initialize(document.getElementById("vdoPlr"), url, true);
      player.play();
      $("body").css({ "background-image": "url(" + ")" });
      $("#min10").show();
      $("#playpauseBtn").show();
      $("#plus10").show();
    } else if (event.keyCode === 32) {
      if (video.paused) {
        video.play();
        $("#playpauseBtn").html("⏸️");
      } else {
        video.pause();
        $("#playpauseBtn").html("▶️");
      }
    } else if (event.keyCode === 39) {
      video.currentTime = video.currentTime + 10;
    } else if (event.keyCode === 37) {
      video.currentTime = video.currentTime - 10;
    }
  });

  $("#playpauseBtn").click(function () {
    if (video.paused) {
      video.play();
      $("#playpauseBtn").html("⏸️");
    } else {
      video.pause();
      $("#playpauseBtn").html("▶️");
    }
  });
  $("#min10").click(function () {
    video.currentTime = video.currentTime - 10;
  });
  $("#plus10").click(function () {
    video.currentTime = video.currentTime + 10;
  });

  /* higher/lower Vote */
  $("#vote").html(Vote);
  $(".arrow-up").click(function () {
    if (Vote < 10) {
      Vote++;
    }
    $("#vote").html(Vote);
  });
  $(".arrow-down").click(function () {
    if (Vote > 1) {
      Vote--;
    }
    $("#vote").html(Vote);
  });
  $(".suiiii").click(function () {
    console.log("hallo");
  });
}

document.body.appendChild(component());
