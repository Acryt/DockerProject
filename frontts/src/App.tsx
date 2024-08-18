import classes from "./App.module.scss";

// React
import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { v4 } from "uuid";

// Components
import Header from "./Organisms/Header/Header";
import Main from "./Organisms/Main/Main";
import Footer from "./Organisms/Footer/Footer";
import Menu from "./Molecules/Menu/Menu";
import Form from "./Molecules/Form/Form";
import Button from "./Atoms/Button/Button";
import Sidebar from "./Molecules/Sidebar/Sidebar";
import Center from "./Organisms/Center/Center";
import VoteCard from "./Molecules/VoteCard/VoteCard";
import TicketsContainer from "./Organisms/TicketsContainer/TicketsContainer";
import VotesContainer from "./Organisms/VotesContainer/VotesContainer";
import CandidatesContainer from "./Organisms/CandidatesContainer/CandidatesContainer";
import Option from "./Atoms/Option/Option";
import Input from "./Atoms/Input/Input";
import Select from "./Atoms/Select/Select";

// Types
import {
	ViewType,
	StateType,
	FilterStateType,
	ActiveCandidate,
	VoteType,
	CandidateType,
	TicketType,
} from "./Utilites/Types";
import CandidateCard from "./Molecules/CandidateCard/CandidateCard";
import TicketCard from "./Molecules/TicketCard/TicketCard";

function App() {
	const [state, setState] = useState<StateType>([]);
	useEffect(() => {
		console.log("useEffect");
		let promise = axios.get("/api/getData");
		promise.then((res: AxiosResponse<any>) => {
			if (res.data) {
				setState(res.data);
			}
		});
		console.log("axios done");
	}, []);
	function addVote(vote: VoteType) {
		console.log("addVote");
		axios
			.post("/api/addVote", vote)
			.then((res) => (vote = { ...vote, _id: res.data._id }))
			.then(() => setState([...state, vote]))
			.then(() => console.log("add done id=" + vote._id))
			.catch((err) => console.log(err));
	}
	function removeVote(id: string) {
		console.log("removeVote");
		let s = state.filter((vote) => id !== vote._id);
		axios
			.delete("/api/deleteVote", { data: { id: id } })
			.then(() => setState(s))
			.then(() => console.log("rem done id=" + id));
		setState(s);
	}

	const [view, setView] = useState<ViewType>("votes");
	const [voteFilter, setVoteFilter] = useState<FilterStateType>("all");
	let filteredState: StateType = state;
	const [activeVote, setActiveVote] = useState<VoteType | undefined>(
		state[0] ? state[state.length - 1] : undefined
	);

	function changeActiveVote(e: any) {
		console.log(e.target.value);
		const activeVote = state.find((vote) => vote._id === e.target.value);
		if (activeVote) {
			setActiveVote(activeVote);
		} else {
			console.log("Голосование не найдено");
		}
	}

	const [activeCandidate, setActiveCandidate] = useState<ActiveCandidate>("");
	async function addCandidate(candidate: CandidateType) {
		console.log("addCandidate");
		axios
			.post("/api/addCandidate", candidate)
			.then((res) => {
				const s = state.filter((vote) => vote._id !== candidate.voteId);
				s.push(res.data! as VoteType);
				setState(s);
			})
			.catch((err) => console.log(err));
	}
	function deleteCandidate(voteId: string, id: string) {
		console.log("deleteCandidate");
		axios
			.delete("/api/deleteCandidate", { data: { voteId: voteId, id: id } })
			.then((res) => {
				const s = state.filter((vote) => vote._id !== res.data._id);
				s.push(res.data! as VoteType);
				setState(s);
			})
			.catch((err) => console.log(err));
	}

	function changeActiveCandidate(e: any) {
		console.log(e.target.value);
		setActiveCandidate(e.target.value);
	}
	function changeView(view: ViewType) {
		setView(view);
	}
	if (voteFilter !== "all") {
		filteredState = state.filter((vote) => vote.status === voteFilter);
	}
	function filterVotes(status: FilterStateType) {
		setVoteFilter(status);
		filteredState = state.filter((vote) => vote.status === status);
	}

	async function addTicket(ticket: TicketType) {
		console.log("addTicket");
		axios
			.post("/api/addTicket", ticket)
			.then((res) => {
				console.log(res.data);
				return res;
			})
			.then((res) => {
				const s = state.filter((vote) => vote._id !== res.data._id);
				s.push(res.data! as VoteType);
				console.log(s);
				setState(s);
			})
			.catch((err) => console.log(err));
	}

	function deleteTicket(voteId: string, id: any) {
		console.log(voteId);
		console.log(id);
		axios
			.delete("/api/deleteTicket", { data: { voteId: voteId, id: id } })
			.then((res) => {
				const s = state.filter((vote) => vote._id !== res.data._id);
				s.push(res.data! as VoteType);
				setState(s);
			})
			.catch((err) => console.log(err));
	}
	// let x = state.filter((vote) => vote._id === activeVote)[0].candidates?.map;
	useEffect(() => {
		console.log("useEffect без axios");
		setState(state);
		const newVote = state.find((vote) => vote._id === activeVote?._id);
		setActiveVote(newVote);
	}, [state]);

	return (
		<div className={classes.App}>
			<Header title="App" />
			<Main>
				<Menu view={view}>
					<hr />
					<Button title="Votes" click={() => changeView("votes")} />
					<Button
						title="Candidates"
						click={() => changeView("candidates")}
					/>
					<Button title="Tickets" click={() => changeView("tickets")} />
					<hr />
					<Button title="All Votes" click={() => filterVotes("all")} />
					<Button
						title="Active Votes"
						click={() => filterVotes("active")}
					/>
					<Button
						title="InActive Votes"
						click={() => filterVotes("inactive")}
					/>
				</Menu>

				{view === "votes" && (
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
							{filteredState.map((vote) => (
								<VoteCard key={v4()} vote={vote}>
									<Button
										click={() => removeVote(vote._id! as string)}
									>
										Delete
									</Button>
								</VoteCard>
							))}
						</VotesContainer>
					</Center>
				)}
				{view === "candidates" && (
					<Center>
						<Form submit={addCandidate}>
							<Select name="voteId" change={changeActiveVote}>
								{state.map((vote) => (
									<Option
										key={v4()}
										title={vote.title}
										value={vote._id}
									/>
								))}
							</Select>
							<Input
								typeInput="text"
								name="name"
								placeholder="candidate"
								value=""
							/>
							<Button>Add</Button>
						</Form>
						<CandidatesContainer>
							{activeVote && activeVote.candidates
								? activeVote.candidates.map((с) => (
										<CandidateCard key={v4()} candidate={с}>
											<Button
												click={() =>
													deleteCandidate(activeVote._id!, с._id!)
												}
											>
												Delete
											</Button>
										</CandidateCard>
								  ))
								: null}
						</CandidatesContainer>
					</Center>
				)}
				{view === "tickets" && (
					<Center>
						<Form submit={addTicket}>
							<Select name="voteId" change={changeActiveVote}>
								{state.map((vote) => (
									<Option
										key={v4()}
										title={vote.title}
										value={vote._id}
									/>
								))}
							</Select>
							<Select name="candidateId" change={changeActiveCandidate}>
								{activeVote && activeVote.candidates
									? activeVote.candidates.map((c) => (
											<Option
												key={v4()}
												title={c.name}
												value={c._id}
											/>
									  ))
									: null}
							</Select>
							<Input
								typeInput="text"
								name="ticket"
								placeholder="ticket"
								value=""
							/>
							<Button>Add</Button>
						</Form>
						<TicketsContainer>
							{activeVote && activeVote.tickets
								? activeVote.tickets.map((t) => (
										<TicketCard key={v4()} ticket={t}>
											<Button
												click={() =>
													deleteTicket(activeVote._id!, t._id)
												}
											>
												Delete
											</Button>
										</TicketCard>
								  ))
								: null}
						</TicketsContainer>
					</Center>
				)}
				<Sidebar />
			</Main>
			<Footer />
		</div>
	);
}

export default App;
