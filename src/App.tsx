import React, { useState } from 'react';
import './App.css';
import Navigation from "./components/Navigation";
import Score from "./components/Score";
import NewPlayer from "./components/NewPlayer";
import Total from "./components/Total";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {IPlayer, IScore, IRoutes} from "./types";
import ROUTES from './routes';
import {nanoid} from 'nanoid';
import {getSum} from './utils';
import {Button, IconButton} from "@material-ui/core";
import {DeleteForever} from "@material-ui/icons";

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
						{players.map((player, index) =>
							<div key={index}>
								{ROUTES[route].scores.map((scoreKey, index) =>
									<Score
										key={index}
										name={player.name}
										value={player.score[scoreKey]}
										handleChange={(value: number) => onChange(player.id, scoreKey, value)}
									/>
								)}
							</div>)
						}
					</Route>
				)}
				<Route path="/total">
					<Total players={players}/>
				</Route>
				<Route path="/">
					<NewPlayer handleSubmit={addPlayer} />
					{players.map((player, index) =>
						<div key={index}>
							{player.name} Σ{getSum(player.score)}
							<IconButton onClick={(e) => deletePlayer(player.id)}>
								<DeleteForever color="secondary"/>
							</IconButton>
						</div>)
					}
					<Button variant="contained" color="primary" onClick={(e) => resetScores()}>
						Новая игра
					</Button>
				</Route>
			</Switch>
		</Router>
    </div>
  );
}

export default App;
