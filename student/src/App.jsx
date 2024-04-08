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
export const PACHONGADDR = '10.20.96.100:5000';


export function flash() { 
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

