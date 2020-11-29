import * as React from 'react';
import {TPlayers} from '../../types';
import {getSum} from "../../utils/score";
import {useState, useEffect, useContext} from "react";
import styles from './Total.module.css';
import {PlayersContext} from "../App/App";

export default function Total() {
	const playersContext = useContext(PlayersContext);

	const [winner, setWinner] = useState('null');

	useEffect(() => {
		setWinner(getWinner(playersContext.state));
	}, [playersContext.state]);

	function getWinner(players: TPlayers): string {
		const bestPlayer =  players
			.reduce((acc, player) => {
				const playerSum = getSum(player.score);

				if (acc.name === '' || playerSum > acc.score) {
					acc = {
						name: player.name,
						score: playerSum
					}
				}
				return acc;
			}, {name: '', score: 0});

		return bestPlayer ? bestPlayer.name : '';
	}

	return(
		<div>
			{playersContext.state.map((player, index) =>
				<div key={index} className={`${styles.player} ${winner === player.name ? styles.winner : ''}`}>
					{player.name} Σ{getSum(player.score)}
				</div>)
			}
		</div>
	)
}