import React from 'react';
import RLoader from 'react-loader-spinner';

const Loader = ({ text }) => (
  <div {...{ className: 'loader' }}>
    <div>
      <RLoader {...{ type: 'Oval', color: '#337ab7' }} />
      {text && (
        <div
          style={{
            wordBreak: 'break-word',
            maxWidth: '80%',
            fontSize: 24,
            marginTop: 12,
          }}
        >
          {text}
        </div>
      )}
    </div>
  </div>
);

export default Loader;
