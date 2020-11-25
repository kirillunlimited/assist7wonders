import Score from "./Score";
import React from "react";
import {IPlayer, TScoreKeys} from "../../types";
import styles from './Scores.module.css';

interface IProps {
	players: Array<IPlayer>;
	scores: Array<TScoreKeys>;
	handleChange: (name: string, scoreKey: TScoreKeys, value: number) => void;
	max?: number;
}

export default function Scores(props: IProps) {
	return(
		<div>
			{props.players.map((player, index) =>
				<div className={styles.player} key={index}>
					<p className={styles.name}>{player.name}</p>
					<div className={styles.scores}>
						{props.scores.map((scoreKey, index, arr) =>
							<Score
								key={index}
								title={arr.length > 1 ? scoreKey : ''}
								value={player.score[scoreKey]}
								handleChange={(value: number) => props.handleChange(player.name, scoreKey, value)}
								max={props.max}
							/>
						)}
					</div>
				</div>)
			}
		</div>
	)
}