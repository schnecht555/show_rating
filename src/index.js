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
  let arrayNews = null;
  let select = 0;
  const video = document.getElementById("vdoPlr");

  mng
    .loadDownWardsCarousel()
    .then(function (arrayNewsCarousel) {
      console.log(arrayNewsCarousel);
      const newsContainer = document.getElementById("news-container");
      const prevBtnNews = document.getElementById("prev-btn-news");
      const nextBtnNews = document.getElementById("next-btn-news");

      const articlesToShow = 2;
      let currentArticleIndex = 0;

      function showArticles() {
        const articles = document.getElementsByClassName("article");
        const totalArticles = articles.length;

        for (let i = 0; i < totalArticles; i++) {
          articles[i].style.display = "none";
        }

        for (let i = 0; i < articlesToShow; i++) {
          const index = (currentArticleIndex + i) % totalArticles;
          articles[index].style.display = "block";
        }
      }

      for (let i = 0; i < arrayNewsCarousel.length; i++) {
        const article = document.createElement("div");
        article.className = "article";

        const img = document.createElement("img");
        img.src = arrayNewsCarousel[i].image_url;
        img.title = arrayNewsCarousel[i].title;
        article.appendChild(img);

        newsContainer.appendChild(article);
      }

      const articles = document.getElementsByClassName("article");
      if (articles.length > 0) {
        articles[0].style.display = "block";
      }

      prevBtnNews.addEventListener("click", function () {
        currentArticleIndex--;
        if (currentArticleIndex < 0) {
          currentArticleIndex = articles.length - 1;
        }
        showArticles();
      });

      nextBtnNews.addEventListener("click", function () {
        currentArticleIndex++;
        if (currentArticleIndex >= articles.length) {
          currentArticleIndex = 0;
        }
        showArticles();
      });

      showArticles();

      setInterval(function () {
        currentArticleIndex++;
        if (currentArticleIndex >= articles.length) {
          currentArticleIndex = 0;
        }
        showArticles();
      }, 1000000);

      document.addEventListener("keydown", function (event) {
        if (event.key === "0") {
          const selectedArticle = articles[currentArticleIndex];
          const selectedTitle = selectedArticle.querySelector("img").title;
          const selectedDescription =
            arrayNewsCarousel[currentArticleIndex].description;
          $("#newsTitle").html(selectedTitle);
          $("#newsDesc").html(selectedDescription);

          if ($("#newsInfo").is(":visible") && !$(".vdoPlr").is(":visible")) {
            $("#newsInfo").hide();
          } else if (
            !$("#newsInfo").is(":visible") &&
            !$(".vdoPlr").is(":visible")
          ) {
            $("#newsInfo").show();
          }
        } else if (event.keyCode === 38) {
          currentArticleIndex++;
          if (currentArticleIndex >= articles.length) {
            currentArticleIndex = 0;
          }
          showArticles();
        } else if (event.keyCode === 40) {
          currentArticleIndex--;
          if (currentArticleIndex < 0) {
            currentArticleIndex = articles.length - 1;
          }
          showArticles();
        }
      });
    })
    .catch(function (error) {
      console.log(error);
    });

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
      //   $("#showTitle").html("Titolo: " + LJ.Title);
      //   $("#showDesc").html("Descrizione: " + LJ.Desc); //we dont need them rn mabye later so we leave them
      $("#divBody").css({ "background-image": "url(" + LJ.URLImg + ")" });
      id = LJ.id;
    })
    .catch(function (error) {
      console.log(error);
    });

  //   $("#okdiv").click(function () {
  //     $("#avgVote").show();
  //     $("#avgVote").html(eng.getAverage(id, Vote).toFixed(2));
  //   });

  /* if enter hide all and show video + button controll */
  $(document).keydown(function (event) {
    if (event.keyCode === 13) {
      if (!$(".vdoPlr").is(":visible")) {
        $("#newsInfo").hide();
        $("#info").hide();
        $("#appMan").hide();
        $("#voteBox").hide();
        $("#tvScreen").hide();
        $(".slider-container").hide();
        $("#divBody").hide();
        $(".vdoPlr").show();
        $("#videoControlls").show();
        var url = arrayVideo[selected].videoUrl;
        var player = MediaPlayer().create();
        player.initialize(document.getElementById("vdoPlr"), url, true);
        player.play();
        $("#min10").show();
        $("#playpauseBtn").show();
        $("#plus10").show();
        $("#newsInfo").hide();
      } else if ($(".vdoPlr").is(":visible")) {
        $("#divBody").show();
        $("#newsInfo").show();
        $("#info").show();
        $("#appMan").show();
        $("#voteBox").show();
        $("#tvScreen").show();
        $(".slider-container").show();
        $(".vdoPlr").hide();
        $("#videoControlls").hide();
        $("#min10").hide();
        $("#playpauseBtn").hide();
        $("#plus10").hide();
        $("#newsInfo").hide();
        $(".vdoPlr").hide();
      }
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
}

document.body.appendChild(component());
