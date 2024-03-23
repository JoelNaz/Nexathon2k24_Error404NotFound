import React from 'react';

const MapEmbed = () => {
  return (
    <div className='flex justify-center items-center h-screen mt-[-70px]'>
      <iframe
        src="https://www.google.com/maps/d/u/0/embed?mid=15aznVv7N7ryi5MsnM_5z00HRK1ft4_Q&ehbc=2E312F"
        width="1000"
        height="600"
        title="Google Maps Embed"
      ></iframe>
    </div>
  );
};

export default MapEmbed;
