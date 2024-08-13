import classes from "./Main.module.scss";
import Sidebar from "../../Molecules/Sidebar/Sidebar";
import Menu from "../../Molecules/Menu/Menu";
import Section from "../Section/Section";

import { VoteType } from "../../Utilites/Types";
import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { randomInt, randomUUID } from "crypto";

function Main(props: any) {
	const [stateV, setStateVotes] = useState<VoteType[]>([]);

	useEffect(() => {
		axios.get("/api/getData").then((response: AxiosResponse<Object>) => {
			setStateVotes(response.data as VoteType[]);
		});
	}, []);

	function addVote() {
		console.log("add");
	}
	function removeVote(id: string) {
		let s = stateV.filter((vote) => id !== vote._id);
		console.log(s);
		setStateVotes(s);
		console.log(stateV);
	}
	function editVote(id: string) {
		console.log("edit");
	}

	return (
		<main className={classes.Main}>
			<Menu />
			<Section
				votes={stateV}
				addVote={addVote}
				removeVote={removeVote}
				editVote={editVote}
			/>
			<Sidebar />
		</main>
	);
}

export default Main;
