import './App.css'
import MyLayout from './component/structural/MyLayout'
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */


function App() {
  return <MyLayout style={{overflow:"hidden"}}/>
}

export default App;

export const NOWIP = '10.20.221.148:53706';
export const PACHONGADDR = '10.20.161.96:5000';
export const VIDEO_URL = `http://${PACHONGADDR}/api/video`;
export const VIDEO_DURATION = 6221;

export function flush() { 
  const data = sessionStorage.getItem("rating_list") ? JSON.parse(sessionStorage.getItem("rating_list")) : null;
  if (data) {
    fetch(`http://${NOWIP}/api/addRatingData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ratinglist: data

      }),
    }).then((res) => {
      if (res.ok) {
        console.log("Upload Successfully!");
        sessionStorage.removeItem('rating_list');
      } else {
        alert("error!");
      }
    });
  }
 

}

export function flush_timeinfo() {
  const timelist = sessionStorage.getItem("timelist") ? JSON.parse(sessionStorage.getItem("timelist") ): [];
  const speedlist = sessionStorage.getItem("speedlist") ? JSON.parse(sessionStorage.getItem("speedlist")) : [];
  const commentlist = sessionStorage.getItem("commentlist") ? JSON.parse(sessionStorage.getItem("commentlist")) : [];
  const pauselist = sessionStorage.getItem("pauselist") ? JSON.parse(sessionStorage.getItem("pauselist")) : [];
  console.log(pauselist);
  if (timelist) {
    fetch(`http://${NOWIP}/api/addTimeListInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeList: timelist,
        speedList: speedlist,
        commentList: commentlist,
        pauseList: pauselist,
      }),
    }).then((res) => {
      if (res.ok) {
        alert("Successfully Upload!");
      } else {
        alert("Error!");
      }
    });
    // sessionStorage.removeItem("timelist");
    // sessionStorage.removeItem("speedlist");
    // sessionStorage.removeItem("commentlist");
    // sessionStorage.removeItem("pauselist");
  }
    

}