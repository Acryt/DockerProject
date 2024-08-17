import classes from "./VoteCard.module.scss";

import { VoteCardPropsType } from "../../Utilites/Types";



export function VoteCard(props: VoteCardPropsType) {

	let date: string = new Date(props.vote.date).toISOString();
	return (
		<div className={classes.VoteCard}>
			<p>{props.vote.title}</p>
			<p>{props.vote.status}</p>
			<p>{date}</p>
			<p>{props.vote._id}</p>
			{props.children}
		</div>
	);
}

export default VoteCard;
