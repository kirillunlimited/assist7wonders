const armada = {
  name: 'Armada',
  maxPlayers: 7,
  wonders: [],
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
  ],
};

export default armada;
