import classes from "./Sidebar.module.scss";
import React, { useState } from "react";
import { SidebarPropsType } from "../../Utilites/Types";
import Button from "../../Atoms/Button/Button";

function Sidebar(props: SidebarPropsType) {

   function handleRemoveClick(e: any) {
      props.setLogs([]);
   }

   return (
      <aside className={classes.Sidebar}>
         <h3>Logs</h3>
         <Button click={handleRemoveClick}>Clear</Button>
         {props.logs.slice().reverse().map((log, index) => <p key={index}>{log}</p>)}
         {props.children}
      </aside>
   );
}

export default Sidebar;