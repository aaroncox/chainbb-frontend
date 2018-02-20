import React from 'react'

import { Grid } from 'semantic-ui-react'

import Accounts from '../../containers/accounts'
import Sidebar from '../../containers/sidebar'

export default class AccountsLayout extends React.Component {
  render() {
    return(
      <Grid divided>
        <Grid.Row>
          <Grid.Column width={4} className='mobile hidden'>
            <Sidebar
              section='accounts'
            />

          </Grid.Column>
          <Grid.Column mobile={16} tablet={12} computer={12}>
            <Accounts />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
