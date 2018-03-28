import React from 'react'

import { Divider, Grid, Header, Segment } from 'semantic-ui-react'

export default class FeedLayout extends React.Component {
  render() {
    return(
      <Grid divided>
        <Grid.Row>
          <Grid.Column width={16}>
            <Segment>
              <Header size='large'>
                chainbb.com is shutting down
              </Header>
              <Divider />
              <p>For more information, please read this post on steemit.com:</p>
              <p>
                <a href='https://steemit.com/chainbb/@jesta/chainbb-com-going-offline'>
                  https://steemit.com/chainbb/@jesta/chainbb-com-going-offline
                </a>
              </p>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
