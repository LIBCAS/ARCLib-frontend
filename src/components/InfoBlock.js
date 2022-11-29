import React from 'react';
import { HelpBlock } from 'react-bootstrap';

const InfoBlock = ({ label, ...props }) =>
  label ? <HelpBlock {...{ className: 'success', ...props }}>{label}</HelpBlock> : <div />;

export default InfoBlock;
