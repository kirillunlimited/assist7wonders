import React, {useEffect, useReducer} from 'react';
import './App.css';
import Navigation from "../Navigation/Navigation";
import {IPlayer, IAddons} from "../../types";
import ROUTES, {RenderRoutes} from '../../config/routes';
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
				<Navigation routes={ROUTES} addons={addons} />
				<RenderRoutes routes={ROUTES} />
			</AddonsContext.Provider>
		</PlayersContext.Provider>
    </div>
  );
}