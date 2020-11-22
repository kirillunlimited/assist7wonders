import * as React from 'react';
import {IPlayer} from '../../types';
import {getSum} from "../../utils/score";
import {useState, useEffect} from "react";
import styles from './Total.module.css';

interface IProps {
	players: Array<IPlayer>
}

export default function Total(props: IProps) {
	const [winner, setWinner] = useState('null');

	useEffect(() => {
		setWinner(getWinner(props.players));
	}, [props.players]);

	function getWinner(players: Array<IPlayer>): string {
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
			{props.players.map((player, index) =>
				<div key={index} className={`${styles.player} ${winner === player.name ? styles.winner : ''}`}>
					{player.name} Σ{getSum(player.score)}
				</div>)
			}
		</div>
	)
}