import classes from "./CategoriesContainer.module.scss";

type CategoriesContainerPropsType = {
	children?: any;
};
function CategoriesContainer(props: CategoriesContainerPropsType) {
	return (
		<section className={classes.CategoriesContainer}>
			categories
			<hr />
			{props.children}
		</section>
	);
}

export default CategoriesContainer;
