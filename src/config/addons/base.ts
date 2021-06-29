import { getScienceTotal, getTreasuryTotal } from '../../utils/score';

const base = {
  name: '7 Wonders',
  maxPlayers: 7,
  wonders: ['Rhodes', 'Alexandria', 'Ephesus', 'Babylon', 'Olympia', 'Halicarnassus', 'Giza'],
  scores: [
    {
      id: 'military',
      color: '#D81F25',
      counters: [
        {
          id: 'military',
        },
      ],
    },
    {
      id: 'treasury',
      color: '#AA8E69',
      counters: [
        {
          id: 'treasury',
          min: 0,
        },
      ],
      sum: getTreasuryTotal,
    },
    {
      id: 'wonders',
      color: '#E8C44A',
      counters: [
        {
          id: 'wonders',
          min: 0,
        },
      ],
    },
    {
      id: 'civilian',
      color: '#2376CF',
      counters: [
        {
          id: 'civilian',
          min: 0,
        },
      ],
    },
    {
      id: 'commerce',
      color: '#E8A33C',
      counters: [
        {
          id: 'commerce',
          min: 0,
        },
      ],
    },
    {
      id: 'guild',
      color: '#91288F',
      counters: [
        {
          id: 'guild',
          min: 0,
        },
      ],
    },
    {
      id: 'science',
      color: '#006118',
      counters: [
        {
          id: 'gear',
          min: 0,
        },
        {
          id: 'compass',
          min: 0,
        },
        {
          id: 'tablet',
          min: 0,
        },
        {
          id: 'wildcard',
          min: 0,
          max: 10,
        },
      ],
      sum: getScienceTotal,
    },
  ],
};

export default base;
