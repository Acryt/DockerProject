import logo from "./logo.svg";
import classes from "./App.module.scss";

import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

import Header from "./Organisms/Header/Header";
import Menu from "./Molecules/Menu/Menu";
import Section from "./Organisms/Section/Section";
import Sidebar from "./Molecules/Sidebar/Sidebar";
import Footer from "./Organisms/Footer/Footer";

import { VoteType, TicketType, CandidateType } from "./Utilites/Types";

function App() {
	const [globalState, setStateVotes] = useState<VoteType[]>([]);
	useEffect(() => {
		console.log("useEffect");
		let promise = axios.get("/api/getData");
		promise.then((res: AxiosResponse<any>) => {
			if (res.data) {
				setStateVotes(res.data);
			}
		});
		console.log("axios done");
	}, []);

	function addVote(vote: VoteType) {
		axios
			.post("/api/postData", vote)
			.then((res) => (vote = { ...vote, _id: res.data._id }))
			.then(() => setStateVotes([...globalState, vote]))
			.then(() => console.log("add done id=" + vote._id))
			.catch((err) => console.log(err));
	}

	function removeVote(id: string) {
		let s = globalState.filter((vote) => id !== vote._id);
		axios
			.delete("/api/deleteData", { data: { id: id } })
			.then(() => setStateVotes(s))
			.then(() => console.log("rem done id=" + id));
		setStateVotes(s);
	}

	function editVote(id: string, updatedVote: VoteType) {
		let s = globalState.map((vote) => (vote._id === id ? updatedVote : vote));
		axios.put("/api/editData", updatedVote);
		setStateVotes(s);
		console.log("edit");
	}

	return (
		<div className={classes.App}>
			<Header title="Voting App" />
			<main className={classes.Main}>
				<Menu />
				<Section
					votes={globalState}
					addVote={addVote}
					removeVote={removeVote}
					editVote={editVote}
				/>
				<Sidebar />
			</main>
			<Footer />
		</div>
	);
}

export default App;
