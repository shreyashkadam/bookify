export const actionType = {
    SET_USER: "SET_USER",
    SET_ALL_USERS: "SET_ALL_USERS",
    SET_ALL_AUDIOBOOKS: "SET_ALL_AUDIOBOOKS",
    SET_ALL_SERIES: "SET_ALL_SEREIS",
    SET_ALL_AUTHORS: "SET_ALL_AUTHORS",
}

const reducer = (state, action) => {
    console.log(action);

    switch (action.type) {
        case actionType.SET_USER:
            return {
                ...state,
                user: action.user,
            };

        case actionType.SET_ALL_USERS:
            return {
                ...state,
                allUsers: action.allUsers,
            };

        case actionType.SET_ALL_AUDIOBOOKS:
            return {
                ...state,
                allAudiobooks: action.allAudiobooks,
            };

        case actionType.SET_ALL_SERIES:
            return {
                ...state,
                allSeries: action.allSeries,
            };

        case actionType.SET_ALL_AUTHORS:
            return {
                ...state,
                allAuthors: action.allAuthors,
            };

        default:
            return state;
    };
};

export default reducer;