import { getScienceTotal } from '../../utils/science';

const leaders = {
  name: 'Leaders',
  maxPlayers: 7,
  wonders: ['Rome'],
  scores: [
    {
      id: 'leaders',
      color: '#BCBCBC',
      counters: [
        {
          id: 'leaders',
          min: 0,
        },
      ],
    },
    {
      id: 'science',
      color: '#006118',
      counters: [
        {
          id: 'swapcards',
          min: 0,
          max: 3,
        },
      ],
      sum: getScienceTotal,
    },
  ],
};

export default leaders;
