import classes from "./Center.module.scss";
// import Form from "../../Molecules/Form/Form";
import { CenterPropsType } from "../../Utilites/Types";
import React, { useState } from "react";

const Center = React.memo((props: CenterPropsType) => {
	console.log("render Center");
	
	function handleRemoveClick(e: any, i: number) {
		console.log("handleRemoveClick");
		
		e.preventDefault();
	}

	return (
		<section className={classes.Center}>
			{props.children}
		</section>
	);
});

export default Center;
