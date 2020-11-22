import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import Navigation from "./components/Navigation";
import Scores from "./components/Scores";
import Home from './components/Home';
import Total from "./components/Total";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {IPlayer, IScore, IRoutes} from "./types";
import ROUTES from './routes';
import {nanoid} from 'nanoid';
import {debounce} from 'debounce';

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
		saveToStorage(players);
	});

	useEffect(() => {
		restoreFromStorage();
	}, []);

	const saveToStorage = useMemo(() => debounce((players: IPlayer[]) => {
		localStorage.setItem('players', JSON.stringify(players));
	}, 500), []);

	function restoreFromStorage(): void {
		const players = localStorage.getItem('players');

		if (players) {
			setPlayers(JSON.parse(players));
		}
	}

	function addPlayer(name: string) {
		if (name) {
			setPlayers([
				...players, {
					id: nanoid(),
					name,
					score: {
						...scoreTemplate
					}
				}
			]);
		}
	}

	function deletePlayer(id: string): void {
		if (id) {
			setPlayers([
				...players.filter(player => {
					return player.id !== id
				})
			]);
		}
	}

	function updatePlayerScore(id: string, payload: IPlayer) {
		if (id) {
			setPlayers([
				...players.map(player => {
					if (player.id === id) {
						return payload;
					} else {
						return player;
					}
				}),
			]);
		}
	}

	function onChange(id: string, scoreKey: keyof IScore, value: number) {
		const player = players.find(player => player.id === id);

		if (player) {
			updatePlayerScore(id, {
				...player,
				score: {
					...player.score,
					[scoreKey]: value
				}
			});
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
