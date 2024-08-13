import classes from "./Sidebar.module.scss";
import axios from "axios";
import React, { useState } from "react";

function Sidebar(prop: any) {
   const [data, setData] = useState([]);

   const updateDataHandler = async () => {
      try {
         const response = await axios.get("/api/getData");
         setData(response.data);
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <aside className={classes.Sidebar}>
         <p>Sidebar</p>
         <button onClick={updateDataHandler}>GetData</button>
         <div className={classes.Sidebar__data}>
            {data.map((item, index) => (
               <div key={index} className={classes.Sidebar__card}>
                  {Object.keys(item).map((key) => (
                     <p key={key}>{key}: {item[key]}</p>
                  ))}
               </div>
            ))}
         </div>
      </aside>
   );
}

export default Sidebar;