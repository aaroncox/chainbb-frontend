import React, { Component } from 'react'
import { Container, Grid, Segment } from 'semantic-ui-react'
import { I18n, Trans } from 'react-i18next';

// import { Link } from 'react-router-dom'

export default class HeaderMenu extends Component {
  render() {
    return (
      <I18n>
        {
          (t, { i18n }) => {
            return (
              <Segment inverted vertical className="footer" style={{marginTop: "2em"}}>
                <Container>
                  <Grid stackable className="divided equal height stackable">
                    <Grid.Column width={16} textAlign='center'>
                      <h4 className="ui inverted header">
                        {t('title')}
                      </h4>
                      {t('footer', "<a href='https://steemit.com' target='_new'>Steem</a>", "<a href='http://jesta.us' target='_new'>jesta</a>")}
                    </Grid.Column>
                  </Grid>
                </Container>
              </Segment>
            )
          }
        }
      </I18n>
    )
  }
}
