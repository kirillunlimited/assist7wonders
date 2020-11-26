import React, {useEffect, useReducer} from 'react';
import './App.css';
import Navigation from "../Navigation/Navigation";
import Scores from "../Scores/Scores";
import Home from '../Home/Home';
import Total from "../Total/Total";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {IPlayer, IRoutes, IAddons} from "../../types";
import ROUTES from '../../config/routes';
import {savePlayersToStorage, saveAddonsToStorage, getPlayersFromStorage, getAddonsFromStorage} from '../../utils/storage';

import playersReducer from '../../reducers/players';
import addonsReducer, {addonsTemplate} from '../../reducers/addons';

interface IPlayersContextProps {
	state: IPlayer[];
	// dispatch: (type: string) => void;
	dispatch: ({type, payload}: {type: string, payload?: any}) => void;
}

interface IAddonsContextProps {
	state: IAddons;
	dispatch: ({type, payload}: {type: string, payload?: any}) => void;
}
//interface IContextProps {   state: IState;   dispatch: Dispatch<Actions>; }

export const PlayersContext = React.createContext({} as IPlayersContextProps);
export const AddonsContext = React.createContext({} as IAddonsContextProps);

export default function App() {
	const [players, playersDispatch] = useReducer(playersReducer, []);
	const [addons, addonsDispatch] = useReducer(addonsReducer, addonsTemplate);

	useEffect(() => {
		savePlayersToStorage(players);
	}, [players]);

	useEffect(() => {
		saveAddonsToStorage(addons);
	}, [addons]);

	useEffect(() => {
		restoreGame();
	}, []);

	function restoreGame(): void {
		playersDispatch({type: 'init', payload: getPlayersFromStorage()});
		addonsDispatch({type: 'init', payload: getAddonsFromStorage()});
	}

	useEffect(() => {
		// TODO
		playersDispatch({type: 'setAddon', payload: addons});
	}, [addons]);

  return (
    <div className="App">
		<PlayersContext.Provider value={{state: players, dispatch: playersDispatch}}>
			<AddonsContext.Provider value={{state: addons, dispatch: addonsDispatch}}>
				<Router>
					<Navigation />
					<h1>7 wonders</h1>
					<Switch>
						{(Object.keys(ROUTES) as Array<keyof IRoutes>).map(route =>
							<Route
								key={route}
								path={ROUTES[route].path}
							>
								<Scores
									scores={ROUTES[route].scores}
									max={ROUTES[route].max}
								/>
							</Route>
						)}
						<Route path="/total">
							<Total />
						</Route>
						<Route path="/">
							<Home />
						</Route>
					</Switch>
				</Router>
			</AddonsContext.Provider>
		</PlayersContext.Provider>
    </div>
  );
}