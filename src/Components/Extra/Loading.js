import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
function LinearIndeterminate(props) {
  return (
    <div style={{flexGrow:1}}>
      <LinearProgress color='secondary' />
      <br />
      <LinearProgress />
      <br />
      <LinearProgress color='secondary' />
    </div>
  );
}
export default LinearIndeterminate;
