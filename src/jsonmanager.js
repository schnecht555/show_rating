export class jsonmanager {
  loadJson() {
    let promise = new Promise(function (resolve, reject) {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("ID");

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
}


