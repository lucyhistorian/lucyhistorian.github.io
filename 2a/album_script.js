
const track_name = {
  "0": "One Track a Day",
  "1": "Gone Too Far",
  "2": "What If I Told You",
  "3": "How Much Work Do I Have To Put In Before I Deserve Happiness",
  "4": "City Blues",
  "5": "This Is Enough",
  "6": "The Barriers All Seem To Disappear",
  "7": "Too Far Gone",
  "8": "Mall Fantasy",
  "9": "Mall Fantasy is Dead",
  "10":"We Are Sun and Moon and Stars",
  "11":"Going Away Party"
}

const track_sub = {
  "0": "Demo Collections, 2014-2017",
  "1": "LP, 2017",
  "2": "EP, 2018",
  "3": "LP, 2018",
  "4": "LP, 2019",
  "5": "EP, 2019",
  "6": "LP, 2020",
  "7": "Remix LP, 2020",
  "8": "LP, 2021",
  "9": "LP, 2022",
  "10":"EP, 2023",
  "11":"LP, 2023"
}

const track_des = {
  "0": "",
  "1": "",
  "2": "",
  "3": "",
  "4": "",
  "5": "",
  "6": "",
  "7": "",
  "8": "",
  "9": "",
  "10":"",
  "11":""
}

const img_base = "images/2am";

const key = window.location.href.split('?album=')[1];

document.getElementById("album_name").innerHTML=track_name[key];
document.getElementById("album_cover").src=img_base+key+".jpg";
document.getElementById("album_sub").innerHTML=track_sub[key];
document.getElementById("album_description").innerHTML=track_description[key];