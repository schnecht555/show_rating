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

  let mng = new jsonmanager();
  var eng = new engine();
  var Vote = 5;
  eng.init();
  var id = 0;
  var arrayVideo = null;
  let select = 0;

  mng.loadCarousel().then(function (arrayVideoCarousel) {
      arrayVideo = arrayVideoCarousel;
     
      console.log(arrayVideo);
      }).catch(function (error) {
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
    $("#tvScreen").hide();
    $("#info").hide();
    $("#appMan").hide();
    $("#voteBox").hide();
    $(".vdoPlr").show();
    $(".slider-container").hide();
    $("#avgVote").html(eng.getAverage(id, Vote).toFixed(2));
    var url = arrayVideo[select].videoUrl;
    var player = MediaPlayer().create();
    player.initialize(document.getElementById("vdoPlr"), url, true);
    player.play();
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
