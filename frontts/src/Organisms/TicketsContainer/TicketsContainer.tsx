import classes from "./TicketsContainer.module.scss";

type TicketsContainerPropsType = {
	children?: any
	
}
function TicketsContainer(props: TicketsContainerPropsType) {

	return (
		<section className={classes.TicketsContainer}>
			Tickets
			<hr/>
			{props.children}
		</section>
	);
}

export default TicketsContainer;
