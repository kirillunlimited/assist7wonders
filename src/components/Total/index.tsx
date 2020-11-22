import * as React from 'react';
import {IPlayer} from '../../types';
import {getSum} from "../../utils";
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

				if (acc.id === 'null' || playerSum > acc.score) {
					acc = {
						id: player.id,
						score: playerSum
					}
				}
				return acc;
			}, {id: 'null', score: 0});

		return bestPlayer ? bestPlayer.id : 'null';
	}

	return(
		<div>
			{props.players.map((player, index) =>
				<div key={index} className={`${styles.player} ${winner === player.id ? styles.winner : ''}`}>
					{player.name} Σ{getSum(player.score)}
				</div>)
			}
		</div>
	)
}