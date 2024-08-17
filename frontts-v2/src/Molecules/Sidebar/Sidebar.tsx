import classes from "./Sidebar.module.scss";
import React, { useState } from "react";
import { SidebarPropsType } from "../../Utilites/Types";

function Sidebar(props: SidebarPropsType) {

   return (
      <aside className={classes.Sidebar}>
         <p>Sidebar</p>
         {props.children}
      </aside>
   );
}

export default Sidebar;