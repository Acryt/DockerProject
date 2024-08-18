import classes from "./CandidatesContainer.module.scss";

type CandidatesContainerPropsType = {
	children?: any;
};
function CandidatesContainer(props: CandidatesContainerPropsType) {
	return (
		<section className={classes.CandidatesContainer}>
			candidates
			<hr />
			{props.children}
		</section>
	);
}

export default CandidatesContainer;
