import _ from "lodash";
import "./styles.css";
import {
  dashjs,
  MediaPlayer,
} from "./lib/cdn.dashjs.org_latest_dash.all.min.js";
import { engine } from "./engine";
import { jsonmanager } from "./jsonmanager";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick.js";

/*
currentPage =1 => main page
currentPage =2 => video page
currentPage =3 => info page
*/

let startPage = 1;
let currentPosEPG = 1;
let currentPage = 1;
let currentPos = 1;
let currentPosVid = 1;
let currentIndex = 0;
let selected = 0;
let slides = null;
let articles = null;
let slidesToShow = 0;
let currentArticleIndex = 0;
let articlesToShow = 0;
let globalArrayNewsCarousel = null;
let globalArrayChannelCarousel = null;
let keyset = null;
let arrayVideo = null;
let video = null;
let app = null;
let appMan = null;
let currentRow = null;

function resizeVideo(fullscreen, left) {
  var vid = document.getElementById("tvScreen");

  vid.setFullScreen(fullscreen);

  if (fullscreen) {
    vid.style.left = "0px";

    vid.style.top = "0px";

    vid.style.width = "100%";

    vid.style.height = "100%";

    vid.style.float = "left";
    vid.style.marginLeft = "-43px";
    vid.style.zIndex = "100";
  } else {
    vid.style.left = left + "px";

    vid.style.top = "0px";

    vid.style.width = "60%";

    vid.style.height = "60%";

    vid.style.position = "absolute";
    vid.style.float = "left";
    vid.style.marginLeft = "-43px";
    vid.style.zIndex = "100";
  }
}

function generateTableRows(data) {
  const tableBody = document.querySelector("#data-table tbody");
  tableBody.innerHTML = "";
  for (
    let i = currentRow * 4;
    i < (currentRow + 1) * 4 && i < data.length;
    i++
  ) {
    const row = data[i];
    const tr = document.createElement("tr");

    const listeningNameCell = document.createElement("td");
    listeningNameCell.textContent = row.listeningName;
    tr.appendChild(listeningNameCell);

    const currentTitleCell = document.createElement("td");
    currentTitleCell.textContent = row.currentTitle;
    tr.appendChild(currentTitleCell);

    const nextTitleCell = document.createElement("td");
    nextTitleCell.textContent = row.nextTitle;
    tr.appendChild(nextTitleCell);

    tableBody.appendChild(tr);
  }
}

function showPrevious() {
  if (currentRow > 0) {
    currentRow--;
    generateTableRows(globalArrayChannelCarousel);
  }
}

function showNext() {
  if ((currentRow + 1) * 4 < globalArrayChannelCarousel.length) {
    currentRow++;
    generateTableRows(globalArrayChannelCarousel);
  }
}

function showSlides() {
  slides = document.getElementsByClassName("slider");
  const totalSlides = slides.length;

  for (let i = 0; i < totalSlides; i++) {
    slides[i].style.display = "none";
  }

  for (let i = 0; i < slidesToShow; i++) {
    const index = (currentIndex + i) % totalSlides;
    slides[index].style.display = "block";
  }
}

function showArticles() {
  articles = document.getElementsByClassName("article");
  let totalArticles = articles.length;

  for (let i = 0; i < totalArticles; i++) {
    articles[i].style.display = "none";
  }

  for (let i = 0; i < articlesToShow; i++) {
    const index = (currentArticleIndex + i) % totalArticles;
    articles[index].style.display = "block";
  }
}

function registerKeyboardEvents(onCustomKeyDown) {
  keyset.setValue(keyset.NAVIGATION);
  document.addEventListener("keydown", onCustomKeyDown);
}

function unregisterKeyboardEvents(onCustomKeyDown) {
  document.removeEventListener("keydown", onCustomKeyDown);
  keyset.setValue(0);
}
$("#prev-btn").css({ "background-color": "yellow" });

//currentpage=1
function onKeyDownMain(e) {
  switch (e.keyCode) {
    case KeyEvent.VK_RIGHT:
    case e.VK_RIGHT:
      console.log("R");
      if (currentPos <= 1) {
        currentPos = 2;
        $("#slider").css({
          "background-image":
            "url(https://media.tarkett-image.com/large/TH_26513017_001.jpg)",
        });
        $("#prev-btn").css({ "background-color": "lightgrey" });
      } else if (currentPos == 2) {
        currentPos = 3;
        $("#slider").css({ "background-image": "url()" });
        $("#next-btn").css({ "background-color": "yellow" });
      }
      break;

    case KeyEvent.VK_LEFT:
    case e.VK_LEFT:
      console.log("L");
      if (currentPos == 2) {
        currentPos = 1;
        $("#prev-btn").css({ "background-color": "yellow" });
        $("#slider").css({ "background-image": "url()" });
      } else if (currentPos == 3) {
        currentPos = 2;
        $("#slider").css({
          "background-image":
            "url(https://media.tarkett-image.com/large/TH_26513017_001.jpg)",
        });
        $("#next-btn").css({ "background-color": "lightgrey" });
      }
      break;
    case KeyEvent.VK_UP:
    case e.VK_UP:
      console.log("U");
      if (currentPos == 1 || currentPos == 2 || currentPos == 3) {
        currentPos = 4;
        $("#next-btn").css({ "background-color": "lightgrey" });
        $("#prev-btn").css({ "background-color": "lightgrey" });
        $("#slider").css({ "background-image": "url()" });
        $("#next-btn-news").css({ "background-color": "yellow" });
      } else if (currentPos == 4) {
        currentPos = 5;
        $("#info").css({
          "background-image":
            "url(https://media.tarkett-image.com/large/TH_26513017_001.jpg)",
        });
        $("#next-btn-news").css({ "background-color": "lightgrey" });
      } else if (currentPos == 5) {
        currentPos = 6;
        $("#prev-btn-news").css({ "background-color": "yellow" });
        $("#info").css({ "background-image": "url()" });
      } else if (currentPos == 6) {
        currentPos = 7;
        $("#epgBtn").css({ "background-color": "yellow" });
        $("#prev-btn-news").css({ "background-color": "lightgrey" });
      }
      break;
    case KeyEvent.VK_DOWN:
    case e.VK_DOWN:
      console.log("D");
      if (currentPos == 6) {
        currentPos = 5;
        $("#info").css({
          "background-image":
            "url(https://media.tarkett-image.com/large/TH_26513017_001.jpg)",
        });
        $("#prev-btn-news").css({ "background-color": "lightgrey" });
      } else if (currentPos == 5) {
        currentPos = 4;
        $("#next-btn-news").css({ "background-color": "yellow" });
        $("#info").css({ "background-image": "url()" });
      } else if (currentPos == 4) {
        currentPos = 3;
        $("#next-btn-news").css({ "background-color": "lightgrey" });
        $("#next-btn").css({ "background-color": "yellow" });
      } else if (currentPos == 7) {
        currentPos = 6;
        $("#epgBtn").css({ "background-color": "lightgrey" });
        $("#prev-btn-news").css({ "background-color": "yellow" });
      }

      break;
    case KeyEvent.VK_ENTER:
    case e.VK_ENTER:
      console.log("E");
      if (currentPos == 1) {
        currentIndex--;
        selected--;
        if (currentIndex < 0) {
          currentIndex = slides.length - 1;
          selected = slides.length - 1;
        }
        console.log(selected);
        showSlides();
      } else if (currentPos == 2) {
        $("#newsInfo").hide();
        $("#info").hide();
        $("#appManDiv").show();
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
        currentPage = 2;
        unregisterKeyboardEvents(onKeyDownMain);
        registerKeyboardEvents(onKeyDownVideo);
        $("#min10").css({ "background-color": "yellow" });
        $("#controllText").css({ "background-color": "lightgrey" });
      } else if (currentPos == 3) {
        currentIndex++;
        selected++;
        if (currentIndex >= slides.length) {
          currentIndex = 0;
          selected = 0;
        }

        showSlides();
      } else if (currentPos == 4) {
        currentArticleIndex--;
        if (currentArticleIndex < 0) {
          currentArticleIndex = articles.length - 1;
        }
        showArticles();
      } else if (currentPos == 5) {
        currentPage = 3;
        const selectedArticle = articles[currentArticleIndex];
        const selectedTitle = selectedArticle.querySelector("img").title;
        const selectedDescription =
          globalArrayNewsCarousel[currentArticleIndex].description;
        $("#newsTitle").html(selectedTitle);
        $("#newsDesc").html(selectedDescription);
        $("#newsInfo").show();
        unregisterKeyboardEvents(onKeyDownMain);
        registerKeyboardEvents(onKeyDownInfo);
      } else if (currentPos == 6) {
        currentArticleIndex++;
        if (currentArticleIndex >= articles.length) {
          currentArticleIndex = 0;
        }
      } else if (currentPos == 7) {
        currentPage = 4;
        $("#epgInfo").show();
        unregisterKeyboardEvents(onKeyDownMain);
        registerKeyboardEvents(onKeyDownEpg);
      }

      break;
    case KeyEvent.VK_BACK:
    case e.VK_BACK:
      startPage = 1;
      currentPos = 1;
      $("#newsInfo").hide();
      $("#info").hide();
      $(".slider-container").hide();
      $("#tvScreen").height("100%");
      $("#tvScreen").width("100%");
      $("#divBody").hide();
      $("#mediaSet").show();
      unregisterKeyboardEvents(onKeyDownMain);
      registerKeyboardEvents(onKeyDownStart);

      break;

    default:
      return;
  }
}
//currentpage=2
function onKeyDownVideo(e) {
  switch (e.keyCode) {
    case KeyEvent.VK_RIGHT:
    case e.VK_RIGHT:
      if (currentPosVid <= 1) {
        currentPosVid = 2;
        $("#min10").css({ "background-color": "lightgrey" });
        $("#playpauseBtn").css({ "background-color": "yellow" });
      } else if (currentPosVid == 2) {
        currentPosVid = 3;
        $("#playpauseBtn").css({ "background-color": "lightgrey" });
        $("#plus10").css({ "background-color": "yellow" });
      }

      break;
    case KeyEvent.VK_LEFT:
    case e.VK_LEFT:
      if (currentPosVid == 2) {
        currentPosVid = 1;
        $("#min10").css({ "background-color": "yellow" });
        $("#playpauseBtn").css({ "background-color": "lightgrey" });
      } else if (currentPosVid == 3) {
        currentPosVid = 2;
        $("#playpauseBtn").css({ "background-color": "yellow" });
        $("#plus10").css({ "background-color": "lightgrey" });
      }

      break;
    case KeyEvent.VK_BACK:
    case e.VK_BACK:
      currentPosVid = 1;
      video.pause();
      $("#divBody").show();
      $("#newsInfo").show();
      $("#info").show();
      $("#appManDiv").hide();
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
      unregisterKeyboardEvents(onKeyDownVideo);
      registerKeyboardEvents(onKeyDownMain);
      currentPage = 1;
      currentPosVid = 1;

      break;
    case KeyEvent.VK_ENTER:
    case e.VK_ENTER:
      if (currentPosVid == 1) {
        video.currentTime = video.currentTime - 10;
      } else if (currentPosVid == 2) {
        if (video.paused) {
          video.play();
          $("#playpauseBtn").html("||");
        } else {
          video.pause();
          $("#playpauseBtn").html(">");
        }
      } else if (currentPosVid == 3) {
        video.currentTime = video.currentTime + 10;
      }
      break;

    default:
      return;
  }
}
//currentpage=3
function onKeyDownInfo(e) {
  switch (e.keyCode) {
    case KeyEvent.VK_BACK:
    case e.VK_BACK:
      console.log("BACK");
      $("#newsInfo").hide();
      unregisterKeyboardEvents(onKeyDownInfo);
      registerKeyboardEvents(onKeyDownMain);
      currentPage = 1;
      break;
    default:
      return;
  }
}
//currentpage=4
function onKeyDownEpg(e) {
  switch (e.keyCode) {
    case KeyEvent.VK_BACK:
    case e.VK_BACK:
      console.log("BACK");
      $("#epgInfo").hide();
      unregisterKeyboardEvents(onKeyDownEpg);
      registerKeyboardEvents(onKeyDownMain);
      currentPage = 1;
      break;

    case KeyEvent.VK_RIGHT:
    case e.VK_RIGHT:
      if (currentPosEPG <= 1) {
        currentPosEPG = 2;
        $("#prev-btn-channel").css({ "background-color": "lightgrey" });
        $("#next-btn-channel").css({ "background-color": "yellow" });
      }
      break;
    case KeyEvent.VK_LEFT:
    case e.VK_LEFT:
      if (currentPosEPG == 2) {
        currentPosEPG = 1;
        $("#next-btn-channel").css({ "background-color": "lightgrey" });
        $("#prev-btn-channel").css({ "background-color": "yellow" });
      }

      break;

    case KeyEvent.VK_ENTER:
    case e.VK_ENTER:
      if (currentPosEPG == 1) {
        showPrevious();
      } else if (currentPosEPG == 2) {
        showNext();
      }
      break;

    default:
      return;
  }
}
function onKeyDownStart(e) {
  switch (e.keyCode) {
    case KeyEvent.VK_UP:
    case e.VK_UP:
      console.log("up");
      startPage = 0;

      $("#tvScreen").show();
      $("#divBody").show();
      $("#info").show();
      $("#slider").show();

      $("#mediaSet").hide();
      loadMainPage();
      unregisterKeyboardEvents(onKeyDownStart);
      registerKeyboardEvents(onKeyDownMain);

    default:
      return;
  }
}

function loadMainPage() {
  registerKeyboardEvents(onKeyDownMain);
  let mng = new jsonmanager();
  var eng = new engine();
  var Vote = 5;
  eng.init();
  var id = 0;

  let arrayNews = null;
  let select = 0;
  video = document.getElementById("vdoPlr");
  try {
    var vid = document.getElementById("tvScreen");
    vid.setFullScreen(false);
  } catch (error) {
    console.log("video not found");
  }
  $("#tvScreen").height("60%");
  $("#tvScreen").width("60%");
  mng
    .loadDownWardsCarousel()
    .then(function (arrayNewsCarousel) {
      globalArrayNewsCarousel = arrayNewsCarousel;
      console.log(arrayNewsCarousel);

      const newsContainer = document.getElementById("news-container");
      const prevBtnNews = document.getElementById("prev-btn-news");
      const nextBtnNews = document.getElementById("next-btn-news");

      articlesToShow = 2;
      currentArticleIndex = 0;

      for (let i = 0; i < arrayNewsCarousel.length; i++) {
        const article = document.createElement("div");
        article.className = "article";

        const img = document.createElement("img");
        img.src = arrayNewsCarousel[i].image_url;
        img.title = arrayNewsCarousel[i].title;
        article.appendChild(img);

        newsContainer.appendChild(article);
      }

      articles = document.getElementsByClassName("article");
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
    })
    .catch(function (error) {
      console.log(error);
    });

  let currentRow = 0;

  document
    .getElementById("prev-btn-channel")
    .addEventListener("click", showPrevious);
  document
    .getElementById("next-btn-channel")
    .addEventListener("click", showNext);

  mng
    .loadChannelCarousel()
    .then(function (arrayChannelCarousel) {
      globalArrayChannelCarousel = arrayChannelCarousel;
      console.log(arrayChannelCarousel);

      generateTableRows(globalArrayChannelCarousel);
    })
    .catch(function (error) {
      console.log("Error loading carousel:", error);
    });

  mng
    .loadCarousel()
    .then(function (arrayVideoCarousel) {
      arrayVideo = arrayVideoCarousel;

      const imageContainer = document.getElementById("image-container");
      const prevBtn = document.getElementById("prev-btn");
      const nextBtn = document.getElementById("next-btn");

      slidesToShow = 5;

      for (let i = 0; i < arrayVideo.length; i++) {
        const slide = document.createElement("div");
        slide.className = "slider";

        const img = document.createElement("img");
        img.src = arrayVideo[i].imgUrl;
        img.title = arrayVideo[i].title;
        slide.appendChild(img);

        imageContainer.appendChild(slide);
      }

      slides = document.getElementsByClassName("slider");
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

        showSlides();
      });

      nextBtn.addEventListener("click", function () {
        currentIndex++;
        selected++;
        if (currentIndex >= slides.length) {
          currentIndex = 0;
          selected = 0;
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
      }, 1000000);
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

      slidesToShow = 5;

      for (let i = 0; i < arrayVideo.length; i++) {
        const slide = document.createElement("div");
        slide.className = "slider";

        const img = document.createElement("img");
        img.src = arrayVideo[i].imgUrl;
        img.title = arrayVideo[i].title;
        slide.appendChild(img);

        imageContainer.appendChild(slide);
      }

      slides = document.getElementsByClassName("slider");
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
        showSlides();
      });

      nextBtn.addEventListener("click", function () {
        currentIndex++;
        selected++;
        if (currentIndex >= slides.length) {
          currentIndex = 0;
          selected = 0;
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
      }, 1000000);
    })
    .catch(function (error) {
      console.log(error);
    });

  mng
    .loadJson()
    .then(function (LJ) {
      $("#divBody").css({ "background-image": "url(" + LJ.URLImg + ")" });
      id = LJ.id;
    })
    .catch(function (error) {
      console.log(error);
    });

  $("#playpauseBtn").click(function () {
    if (video.paused) {
      video.play();
      $("#playpauseBtn").html("||");
    } else {
      video.pause();
      $("#playpauseBtn").html(">");
    }
  });
  $("#min10").click(function () {
    video.currentTime = video.currentTime - 10;
  });
  $("#plus10").click(function () {
    video.currentTime = video.currentTime + 10;
  });
}

function loadTV() {
  registerKeyboardEvents(onKeyDownStart);
  $("#info").hide();
  $("#slider").hide();
  let mng = new jsonmanager();
  mng
    .loadMediaSetJson()
    .then(function (LM) {
      let mdstUrl = "https://enabler.msf.cdn.mediaset.net/";

      $("#imgSinistra").attr("src", mdstUrl + LM.imgSinistra);
      $("#imgSfondo").attr("src", mdstUrl + LM.imgSfondo);
      $("#testo1").html(LM.riga1Testo);
      $("#testo2").html(LM.riga2Testo);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function component() {
  appMan = document.getElementById("appMan");
  app = appMan.getOwnerApplication(document);
  keyset = app.privateData.keyset;

  registerKeyboardEvents(onKeyDownStart);

  app.show();
  try {
    var vid = document.getElementById("tvScreen");
    vid.bindToCurrentChannel();
    vid.setFullScreen(true);
    vid.onChannelChangeSucceeded = function () {
      console.log("Channel changed")
    };
  } catch (error) {
    console.log("video not found");
  }
  $("divBody").hide();

  loadTV();
}

document.body.appendChild(component());
