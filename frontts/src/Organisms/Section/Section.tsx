import classes from "./Section.module.scss";
import Form from "../../Molecules/Form/Form";
import { VoteType } from "../../Utilites/Types";
import React, { useState } from "react";
type SectionPropsType = {
	title?: string;
	votes: Array<VoteType>;
	addVote?: Function;
	removeVote: Function;
	editVote?: Function;
};

function Section(props: SectionPropsType) {
	return (
		<section className={classes.Section}>
			{
				props.votes.map((vote) => {
					return (
						<React.Fragment key={vote._id}>
						<button onClick={() => props.removeVote(vote._id)}>Remove</button>
						</React.Fragment>
					)
				})
			}
		</section>
	);
}

export default Section;
