import classes from "./CandidateCard.module.scss";

import { CandidateType } from "../../Utilites/Types";

type CandidateCardPropsType = {
	children?: React.ReactNode;
	candidate: CandidateType;
}

export function CandidateCard(props: CandidateCardPropsType) {

	return (
		<div className={classes.CandidateCard}>
			<p>{props.candidate._id}</p>
			<p>{props.candidate.name}</p>
			{props.children}
		</div>
	);
}

export default CandidateCard;
