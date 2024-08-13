export type CandidateType = {
	_id?: string;
	candidateName?: string;
};

export type TicketType = {
	_id?: string;
	ticket?: string;
	vote?: string;
};

export type StatusType = "active" | "inactive";

export type VoteType = {
	_id?: string;
	title?: String;
	date?: Date;
	status?: StatusType;
	candidates?: [CandidateType];
	tickets?: [TicketType];
};

export type HeaderPropsType = {
	title?: string;
};
