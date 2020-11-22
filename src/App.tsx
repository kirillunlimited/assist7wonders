import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from "./components/Navigation";
import Scores from "./components/Scores";
import Home from './components/Home';
import Total from "./components/Total";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {IPlayer, TScoreKeys, IRoutes} from "./types";
import ROUTES from './routes';
import {savePlayersToStorage, getPlayersFromStorage} from './utils/storage';

const scoreTemplate = {
	military: 0,
	treasury: 0,
	wonders: 0,
	civilian: 0,
	commerce: 0,
	guild: 0,
	compass: 0,
	tablet: 0,
	gear: 0
};

function App() {
	const [players, setPlayers] = useState<IPlayer[]>([]);

	useEffect(() => {
		savePlayersToStorage(players);
	}, [players]);

	useEffect(() => {
		restorePlayers();
	}, []);

	function restorePlayers(): void {
		setPlayers(getPlayersFromStorage());
	}

	function addPlayer(name: string) {
		if (name) {
			setPlayers([
				...players, {
					name,
					score: {
						...scoreTemplate
					}
				}
			]);
		}
	}

	function deletePlayer(name: string): void {
		if (name) {
			setPlayers([
				...players.filter(player => {
					return player.name !== name
				})
			]);
		}
	}

	function onChange(name: string, scoreKey: TScoreKeys, value: number): void {
		const player = players.find(player => player.name === name);

		if (player) {
			setPlayers([
				...players.map(player => {
					if (player.name === name) {
						return {
							...player,
							score: {
								...player.score,
								[scoreKey]: value
							}
						};
					} else {
						return player;
					}
				}),
			]);
		}
	}

	function resetScores() {
		setPlayers([
			...players.map(player => {
				return {
					...player,
					score: {
						...scoreTemplate
					}
				}
			}),
		]);
	}

  return (
    <div className="App">
		<Router>
			<Navigation/>
			<h1>7 wonders</h1>
			<Switch>
				{(Object.keys(ROUTES) as Array<keyof IRoutes>).map(route =>
					<Route
						key={route}
						path={ROUTES[route].path}
					>
						<Scores
							players={players}
							scores={ROUTES[route].scores}
							handleChange={onChange}
						/>
					</Route>
				)}
				<Route path="/total">
					<Total players={players}/>
				</Route>
				<Route path="/">
					<Home
						players={players}
						handleAdd={addPlayer}
						handleDelete={deletePlayer}
						handleReset={resetScores}
					/>
				</Route>
			</Switch>
		</Router>
    </div>
  );
}

export default App;
