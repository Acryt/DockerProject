// import axios from 'axios';
import logo from "./logo.svg";
import "./App.scss";
import Header from "./Organisms/Header/Header";
import Main from "./Organisms/Main/Main";
import Footer from "./Organisms/Footer/Footer";
import React from "react";
import { VoteType, TicketType, CandidateType } from "./Utilites/Types";

function App() {
	return (
		<div className="App">
			<Header title="Voting App" />
			<Main />
			<Footer />
		</div>
	);
}

export default App;
