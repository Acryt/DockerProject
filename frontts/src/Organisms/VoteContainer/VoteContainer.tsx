import React from "react";
import classes from "./VoteContainer.module.scss";

type TicketsContainerPropsType = {
	children?: any
}
const VoteContainer = React.memo((props: TicketsContainerPropsType) => {
	console.log("render VoteContainer");
	
	return (
		<section className={classes.TicketsContainer}>
			Votes
			<hr/>
			{props.children}
		</section>
	);
})

export default VoteContainer;
