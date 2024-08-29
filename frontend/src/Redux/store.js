import { legacy_createStore, combineReducers, applyMiddleware, compose } from "redux";
import { reducer as AdminReducer } from "./AdminReducer/reducer";
import { reducer as AuthReducer } from "./AuthReducer/reducer";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    AdminReducer: AdminReducer, // Provide a key ('admin') for AdminReducer
    AuthReducer: AuthReducer, // Provide a key ('auth') for AuthReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = legacy_createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
);
