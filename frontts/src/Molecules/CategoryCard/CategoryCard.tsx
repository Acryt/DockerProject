import classes from "./CategoryCard.module.scss";

import { CategoryType } from "../../Utilites/Types";

type CategoryCardPropsType = {
	children?: React.ReactNode;
	category: CategoryType;
}

export function CategoryCard(props: CategoryCardPropsType) {

	let date: string = new Date(props.category.date).toISOString();
	return (
		<div className={classes.CategoryCard}>
			<p>{props.category.title}</p>
			<p>{props.category.status}</p>
			<p>{date}</p>
			<p>{props.category._id}</p>
			{props.children}
		</div>
	);
}

export default CategoryCard;
