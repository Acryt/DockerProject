import classes from "./VoteContainer.module.scss";

type TicketsContainerPropsType = {
	children?: any
}
function VoteContainer(props: TicketsContainerPropsType) {

	return (
		<section className={classes.TicketsContainer}>
			Votes
			<hr/>
			{props.children}
		</section>
	);
}

export default VoteContainer;
