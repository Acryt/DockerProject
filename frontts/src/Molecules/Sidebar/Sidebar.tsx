import classes from "./Sidebar.module.scss";
import React, { useState } from "react";
import Button from "../../Atoms/Button/Button";
import { logsType } from "../../Utilites/Types";

type SidebarPropsType = {
	children?: any;
	logs: Array<logsType>;
	setLogs: Function;
};
function Sidebar(props: SidebarPropsType) {
	function handleRemoveClick(e: any) {
		props.setLogs([]);
	}

	return (
		<aside className={classes.Sidebar}>
				<h3>Logs</h3>
            <hr/>
				<Button click={handleRemoveClick}>Clear</Button>
				{props.logs
					.slice()
					.reverse()
					.map((log, index) => (
						<p
							key={index}
							className={log.err ? classes.error : classes.success}
						>
							{log.err ? `${log.err}` : log.msg}
						</p>
					))}
				{props.children}
		</aside>
	);
}

export default Sidebar;
