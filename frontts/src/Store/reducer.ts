const initialState = {
	apple: 10,
};

const reducer = (state = initialState, action: { type: any; [key: string]: any }) => {
	let newState = { ...state };
	switch (action.type) {
		case 'SET_APPLE':
			console.log("SET_APPLE");
			newState.apple = action.apple;
			return newState;
		case 'ADD_APPLE':
			console.log("ADD_APPLE");
			if (action.apple > 0) {
				newState.apple += action.apple;
			} else {
				newState.apple += 1;
			}
			return newState;
		default:
			return newState;
	}
};

export default reducer;