import _ from 'lodash';
import "./styles.css"
import { engine } from './engine';
import { jsonmanager } from './jsonmanager';
function component() {
  var appMan = document.getElementById("appMan");
  app = appMan.getOwnerApplication(document);
  app.show();
 
  let mng = new jsonmanager();
        var eng = new engine();
        var Vote = 5;
        eng.init();
        var id = 0;
        
        mng.loadJson()
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