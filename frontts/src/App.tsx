import classes from "./App.module.scss";

// React
import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { v4 } from "uuid";

// Components
import Header from "./Organisms/Header/Header";
import Input from "./Atoms/Input/Input";
import Button from "./Atoms/Button/Button";
import Main from "./Organisms/Main/Main";
import Menu from "./Molecules/Menu/Menu";
import Center from "./Organisms/Center/Center";
import Form from "./Molecules/Form/Form";
import Option from "./Atoms/Option/Option";
import Sidebar from "./Molecules/Sidebar/Sidebar";
import Footer from "./Organisms/Footer/Footer";
import VotesContainer from "./Organisms/VotesContainer/VotesContainer";
import VoteCard from "./Molecules/VoteCard/VoteCard";
import Select from "./Atoms/Select/Select";

// Types
import { StatusType, VoteType, CandidateType } from "./Utilites/Types";

// import { VoteType, TicketType, CandidateType } from "./Utilites/Types";
type FilterStateType = StatusType | null;

function App() {
	// States
	const [globalState, setStateVotes] = useState<VoteType[]>([]);
	const [filter, setFilter] = useState<FilterStateType>(null);
	const [activeVoteId, setActiveVoteId] = useState<string>(globalState[0]?._id || "");
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
	// Filtration
	let filtered = globalState;
	if (filter !== null) {
		filtered = globalState.filter((vote) => vote.status === filter);
	}
	let activeVote: VoteType | undefined = globalState.find((vote) => vote._id === activeVoteId);
	function setActiveVote(e: any) {
		activeVote = globalState.find( (vote) => vote._id === e.target.value ) || undefined;
		setActiveVoteId(globalState.find( (vote) => vote._id === e.target.value )?._id || "");
	}
	
	// Vote Functions
	function addVote(vote: VoteType) {
		console.log("addVote");
		axios
			.post("/api/postVote", vote)
			.then((res) => (vote = { ...vote, _id: res.data._id }))
			.then(() => setStateVotes([vote, ...globalState]))
			.then(() => console.log("add done id=" + vote._id))
			.catch((err) => console.log(err));
	}

	function removeVote(id: string) {
		console.log("removeVote");
		let s = globalState.filter((vote) => id !== vote._id);
		axios
			.delete("/api/deleteVote", { data: { id: id } })
			.then(() => setStateVotes(s))
			.then(() => console.log("rem done id=" + id));
		setStateVotes(s);
	}

	function editVote(id: string, updatedVote: VoteType) {
		console.log("editVote");
		let s = globalState.map((vote) => (vote._id === id ? updatedVote : vote));
		axios.put("/api/putVote", updatedVote);
		setStateVotes(s);
	}
	// Candidate Functions
	function getCandidates(voteId: CandidateType) {
		let promise = axios.get("/api/getCandidates/?voteId=" + voteId);
		promise.then((res: any) => {
			console.log(res.data);
		});
	}
	function addCandidate(candidate: CandidateType) {
		let data = candidate;
		axios
			.post("/api/postCandidate", data)
			.then((res) => console.log(res.data))
			.then((data) =>
				setStateVotes(
					globalState.map((vote) => {
						if (vote._id === candidate.voteId && vote.candidates) {
							vote.candidates.push(candidate);
						}
						return vote; // Add this line to return the updated vote
					})
				)
			)
			.catch((err) => console.log(err));
	}

	function filterVotes(status: FilterStateType) {
		setFilter(status);
	}

	return (
		<div className={classes.App}>
			<Header title="App" />
			<Main>
				<Menu>
					<Button title="All Votes" click={() => filterVotes(null)} />
					<Button
						title="Active Votes"
						click={() => filterVotes("active")}
					/>
					<Button
						title="InActive Votes"
						click={() => filterVotes("inactive")}
					/>
				</Menu>
				<Center>
					<Form submit={addVote}>
						<Input
							typeInput="text"
							name="title"
							placeholder="title"
							value=""
						/>
						<Select name="status">
							<Option title="active" value="active" />
							<Option title="inactive" value="inactive" />
						</Select>
						<Input typeInput="date" name="date" value="" />
						<Button>Add</Button>
					</Form>
					<VotesContainer>
						{filtered.map((vote) => (
							<VoteCard key={v4()} vote={vote}>
								<Button
									click={() => editVote(vote._id! as string, vote)}
								>
									Edit
								</Button>
								<Button click={() => removeVote(vote._id! as string)}>
									Delete
								</Button>
							</VoteCard>
						))}
					</VotesContainer>
				</Center>
				<Sidebar>
					<Form submit={addCandidate}>
						<Select name="voteId">
							{globalState.map((vote) => (
								<Option
									key={v4()}
									title={vote.title}
									value={vote._id}
								/>
							))}
						</Select>
						<Input
							typeInput="text"
							name="candidateName"
							placeholder="candidate"
							value=""
						/>
						<Button>Add</Button>
					</Form>
					<Form>
						<Select name="vote">
							{globalState.map((vote) => (
								<Option
									key={v4()}
									title={vote.title}
									value={vote._id}
								/>
							))}
						</Select>
						<Select name="candidate" change={setActiveVote}>
							{activeVote?.candidates ? activeVote.candidates.map((candidate) => (
								<Option
									key={v4()}
									title={candidate.candidateName as string}
									value={candidate._id as string}
								/>
							)) : null }
						</Select>
						<Input
							typeInput="text"
							name="ticket"
							placeholder="ticket number"
							value=""
						/>
						<Button>Add</Button>
					</Form>
				</Sidebar>
			</Main>
			<Footer />
		</div>
	);
}

export default App;
