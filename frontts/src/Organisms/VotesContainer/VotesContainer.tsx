import classes from "./VotesContainer.module.scss";

type VotesContainerPropsType = {
	children?: any;
};
function VotesContainer(props: VotesContainerPropsType) {
	return (
		<section className={classes.VotesContainer}>
			votes
			<hr />
			{props.children}
		</section>
	);
}

export default VotesContainer;
