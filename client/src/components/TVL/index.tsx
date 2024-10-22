import React, { useState, useEffect } from 'react';

const TVL = () => {
  const [formattedValue, setFormattedValue] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.llama.fi/tvl/BaseSwap');
        const data = await response.json();
        // console.log(data)


        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(data);

        setFormattedValue(formatted);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {formattedValue}
    </div>
  );
};

export default TVL;
