import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from "../../components/Navigation/Navigation";
import Scores from "../Scores/Scores";
import Home from '../Home/Home';
import Total from "../Total/Total";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {IPlayer, TScoreKeys, IRoutes, IAddons} from "../../types";
import ROUTES from '../../config/routes';
import {savePlayersToStorage, saveAddonsToStorage, getPlayersFromStorage, getAddonsFromStorage} from '../../utils/storage';

const scoreTemplate = {
	military: 0,
	treasury: 0,
	wonders: 0,
	civilian: 0,
	commerce: 0,
	guild: 0,
	compass: 0,
	tablet: 0,
	gear: 0,
	cities: 0,
	debt: 0,
	leaders: 0
};

export const addonsTemplate: IAddons = {
	cities: false,
	leaders: false
};

export default function App() {
	const [players, setPlayers] = useState<IPlayer[]>([]);
	const [addons, setAddons] = useState(addonsTemplate);

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
		setPlayers(getPlayersFromStorage());
		setAddons(getAddonsFromStorage());
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

	function toggleAddon(addon: keyof IAddons, value: boolean): void {
		setAddons({
			...addons,
			[addon]: value
		});

		if (!value) {
			setPlayers([
				...players.map(player => {
						return {
							...player,
							score: {
								...player.score,
								[addon]: 0
							}
						};
				}),
			]);
		}
	}

  return (
    <div className="App">
		<Router>
			<Navigation
				addons={addons}
			/>
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
							max={ROUTES[route].max}
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
						addons={addons}
						handleAddonToggle={toggleAddon}
					/>
				</Route>
			</Switch>
		</Router>
    </div>
  );
}