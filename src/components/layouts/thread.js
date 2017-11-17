import React from 'react'

import { Grid } from 'semantic-ui-react'

import Thread from '../../containers/thread'
import Sidebar from '../../containers/sidebar'

export default class ThreadLayout extends React.Component {
  render() {
    const params = this.props.match.params;
    return(
      <Grid>
        <Grid.Row>
          <Grid.Column width={4} className='mobile hidden'>
            <Sidebar section='thread' />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={12} computer={12}>
            <Thread params={params} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
