import classes from "./Section.module.scss";
// import Form from "../../Molecules/Form/Form";
import { VoteType, StatusType } from "../../Utilites/Types";
import React, { useState } from "react";
type SectionPropsType = {
	title?: string;
	votes: Array<VoteType>;
	addVote: (vote: VoteType) => void;
	removeVote: (id: string) => void;
	editVote: Function;
};

function Section(props: SectionPropsType) {
	// Example of stopPropagation
	function removeHandler(e: any, i: number) {
		e.preventDefault();
		props.removeVote(props.votes[i]._id!);
	}
	function addHandler(e: any) {
		e.preventDefault();
		const formData = new FormData(e.target.form);
		const date = new Date(formData.get('date') as string);
		props.addVote({
			title: formData.get("title") as string,
			status: formData.get("status") as StatusType,
			date,
		});
	}

	function handleRemoveClick(e: any, i: number) {
		e.preventDefault();
	}

	return (
		<section className={classes.Section}>
			<form key={props.title} className={classes.AddVote}>
				<input type="text" name="title" placeholder="title"/>
				<input type="text" name="status" placeholder="status"/>
				<input type="date" name="date" placeholder="date"/>
				<button onClick={(e) => addHandler(e)}>Add</button>
			</form>
			{props.votes.map((v, i) => {
				return (
					<form key={v._id!} className={classes.Vote}>
						<h1>{props.votes[i].title}</h1>
						<button onClick={(e) => removeHandler(e, i)}>x</button>
					</form>
				);
			})}
		</section>
	);
}

export default Section;
