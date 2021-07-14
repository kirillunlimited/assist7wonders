import { getScienceTotal } from '../../utils/science';

const armada = {
  name: 'Armada',
  maxPlayers: 7,
  wonders: ['Siracusa'],
  scores: [
    {
      id: 'naval',
      color: '#00AEEB',
      counters: [
        {
          id: 'naval',
        },
      ],
    },
    {
      id: 'islands',
      color: '#6EAA46',
      counters: [
        {
          id: 'islands',
          min: 0,
        },
      ],
    },
    {
      id: 'dockyard',
      color: '#048CB1',
      counters: [
        {
          id: 'dockyard',
          min: 0,
        },
      ],
    },
    {
      id: 'science',
      color: '#006118',
      counters: [
        {
          id: 'mostcards',
          min: 0,
          max: 10,
        },
      ],
      sum: getScienceTotal,
    },
  ],
};

export default armada;
