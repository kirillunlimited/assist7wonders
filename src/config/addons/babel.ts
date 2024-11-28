import { getBabelTotal } from '../../utils/score';

const babel = {
  name: 'Babel',
  maxPlayers: 7,
  wonders: [],
  scores: [
    {
      id: 'babel',
      color: '#70809A',
      counters: [
        {
          id: 'babel',
          min: 0,
          max: 3
        },
      ],
      sum: getBabelTotal,
    },
    {
      id: 'projects',
      color: '#9E3F2B',
      counters: [
        {
          id: 'projects',
        },
      ],
    },
  ],
};

export default babel;
