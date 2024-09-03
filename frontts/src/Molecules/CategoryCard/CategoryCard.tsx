import classes from "./CategoryCard.module.scss";

import { CategoryType } from "../../Utilites/Types";

type CategoryCardPropsType = {
	children?: React.ReactNode;
	category: CategoryType;
}

export function CategoryCard(props: CategoryCardPropsType) {
	return (
		<div className={classes.CategoryCard}>
			<p>{props.category.title}</p>
			<p>{props.category.status}</p>
			{props.children}
			<p className="s">{props.category._id}</p>
		</div>
	);
}

export default CategoryCard;
