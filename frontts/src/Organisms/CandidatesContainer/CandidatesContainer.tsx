import classes from "./CandidatesContainer.module.scss";

type CandidatesContainerPropsType = {
	children?: any;
	initFunc?: Function;
};
function CandidatesContainer(props: CandidatesContainerPropsType) {
	if (props.initFunc) props.initFunc();

	return (
		<section className={classes.CandidatesContainer}>
			candidates
			<hr />
			{props.children}
		</section>
	);
}

export default CandidatesContainer;
