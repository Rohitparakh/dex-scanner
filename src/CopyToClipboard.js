import React, { useState } from 'react';

const CopyToClipboard = ({ textToCopy, displayText }) => {
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopyClick = () => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopySuccess('Copied!');

        // Clear the success message after 3 seconds
        setTimeout(() => {
          setCopySuccess('');
        }, 3000);
      })
      .catch(() => {
        setCopySuccess('Failed to copy');

        // Clear the error message after 3 seconds
        setTimeout(() => {
          setCopySuccess('');
        }, 3000);
      });
  };

  return (
    <span className='copy' style={{ textAlign: 'center', padding: '0px' }}>
      <button onClick={handleCopyClick} style={{ padding: '5px 10px', cursor: 'pointer' }}>
      {copySuccess !=''? copySuccess:displayText}
      </button>
      
    </span>
  );
};

export default CopyToClipboard;
