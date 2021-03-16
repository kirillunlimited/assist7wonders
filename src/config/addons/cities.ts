const cities = {
  name: 'Cities',
  maxPlayers: 8,
  wonders: ['Petra', 'Byzantium'],
  scores: [
    {
      id: 'debt',
      color: '#8F7B66',
      counters: [
        {
          id: 'debt',
          max: 0,
        },
      ],
    },
    {
      id: 'cities',
      color: '#545454',
      counters: [
        {
          id: 'cities',
          min: 0,
        },
      ],
    },
  ],
};

export default cities;
