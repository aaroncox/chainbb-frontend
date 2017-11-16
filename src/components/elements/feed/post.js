import React from 'react';

import { Grid, Header, Icon, Label, Popup, Segment } from 'semantic-ui-react'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router-dom'
import AccountAvatar from '../account/avatar'
import AccountLink from '../account/link'
import Paginator from '../forum/post/paginator'
import PostVotes from '../../../containers/post/votes'

export default class FeedPost extends React.Component {
  render() {
    let {topic} = this.props,
        paginator = false
    if(topic.children > 10) {
      paginator = (
        <Paginator
          perPage={10}
          total={topic.children}
          url={topic.url}
        />
      )
    }
    return (
      <Segment attached key={topic._id}>
        <Grid>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column width={1} className="center aligned tablet or lower hidden">
              {(topic.reblogged_by.length > 0)
                ? (
                  <Popup
                    trigger={<Icon size='large' name='repeat' color='blue' />}
                    position='left center'
                    hoverable
                    content={
                      <Header>
                        Reblogged by...
                        <Header.Subheader>
                          {topic.reblogged_by.map((account, i) => <span key={i}>
                            <AccountLink username={account} />
                          </span>)}
                        </Header.Subheader>
                      </Header>
                    }
                  />

                )
                : ''
              }
            </Grid.Column>
            <Grid.Column width={1}>
              <AccountAvatar
                username={topic.author}
                style={{minHeight: '35px', minWidth: '35px', marginBottom: 0}}
              />
            </Grid.Column>
            <Grid.Column mobile={10} tablet={10} computer={10} largeScreen={10}>
              <Header size='small'>
                <Header.Content>
                  <Link to={`${topic.url}`}>
                    {topic.title}
                  </Link>
                  <Header.Subheader>
                    {'↳ '}
                    <TimeAgo date={`${topic.created}Z`} />
                    {' • '}
                    <AccountLink username={topic.author} />
                    {paginator}
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column width={4} className="center aligned tablet or lower hidden">
              <Header size='small'>
                <Label size='small' color='grey' basic style={{marginLeft: '0.5em'}}>
                  <Icon color='grey' name='comments' />{topic.children}&nbsp;
                </Label>
                <PostVotes
                  target={topic}
                />
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }
}
