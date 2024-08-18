import classes from "./TicketCard.module.scss";

import { TicketType } from "../../Utilites/Types";

type TicketCardPropsType = {
	children?: React.ReactNode;
	ticket: TicketType;
}

export function TicketCard(props: TicketCardPropsType) {

	return (
		<div className={classes.TicketCard}>
			<p>{props.ticket.ticket}</p>
			<p>{props.ticket.candidateId}</p>
			<p>{props.ticket.voteId}</p>
			{props.children}
		</div>
	);
}

export default TicketCard;
