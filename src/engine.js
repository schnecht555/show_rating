import { jsonmanager } from "./jsonmanager";
export class engine {
  init() {
    if (!localStorage.getItem("rating")) {
      let rating = [];
      const jsonString = JSON.stringify(rating);
      localStorage.setItem("rating", jsonString);
    }
  }

  getCurrentDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = dd + "/" + mm + "/" + yyyy;
    return formattedToday;
  }

  getAverage(id, Vote) {
    const mng = new jsonmanager();
    let array = mng.getArray();

    array.push({
      ID: id,
      Date: this.getCurrentDate(),
      Rating: Vote,
    });
    mng.setArray(array);

    let total = 0;
    let totalRating = 0;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element.ID == id) {
        total++;
        totalRating = totalRating + element.Rating;
        console.log(total + " " + totalRating);
      }
    }
    return totalRating / total;
  }
}
