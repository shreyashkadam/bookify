export const actionType = {
    SET_USER: "SET_USER",
    SET_ALL_USERS: "SET_ALL_USERS",
    SET_ALL_AUDIOBOOKS: "SET_ALL_AUDIOBOOKS",
    SET_ALL_SERIES: "SET_ALL_SEREIS",
    SET_ALL_AUTHORS: "SET_ALL_AUTHORS",
    SET_SEARCH_TERM: "SET_SEARCH_TERM",
    SET_FILTER_TERM: "SET_FILTER_TERM",
    SET_AUTHOR_FILTER: "SET_AUTHOR_FILTER",
    SET_LANGUAGE_FILTER: "SET_LANGUAGE_FILTER",
    SET_SERIES_FILTER: "SET_SERIES_FILTER",
    SET_AUDIOBOOK: "SET_AUDIOBOOK",
    SET_AUDIOBOOK_PLAYING: "SET_AUDIOBOOK_PLAYING",
    SET_MINI_PLAYER: "SET_MINI_PLAYER",
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

        case actionType.SET_SEARCH_TERM:
            return {
                ...state,
                searchTerm: action.searchTerm,
            };

        case actionType.SET_FILTER_TERM:
            return {
                ...state,
                filterTerm: action.filterTerm,
            };

        case actionType.SET_AUTHOR_FILTER:
            return {
                ...state,
                authorFilter: action.authorFilter,
            };

        case actionType.SET_LANGUAGE_FILTER:
            return {
                ...state,
                languageFilter: action.languageFilter,
            };

        case actionType.SET_SERIES_FILTER:
            return {
                ...state,
                seriesFilter: action.seriesFilter,
            };

        case actionType.SET_AUDIOBOOK:
            return {
                ...state,
                audiobook: action.audiobook,
            };

        case actionType.SET_AUDIOBOOK_PLAYING:
            return {
                ...state,
                isAudiobookPlaying: action.isAudiobookPlaying,
            };

        case actionType.SET_MINI_PLAYER:
            return {
                ...state,
                miniPlayer: action.miniPlayer,
            };

        default:
            return state;
    };
};

export default reducer;