import React from 'react';

import { Grid, Header, Icon, List, Popup, Segment } from 'semantic-ui-react'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router-dom'
import PlatformLink from '../../../utils/link/platform'
import AccountAvatar from '../account/avatar'
import AccountLink from '../account/link'
import PostVotes from '../../../containers/post/votes'

export default class PostTitle extends React.Component {
  render() {
    const { content } = this.props
    let rootTitle = false
    if(this.props.op) {
      rootTitle = (
        <Segment inverted color='blue' attached stacked={(this.props.page !== 1)}>
          <Header size='huge'>
            <Icon name='comments' />
            <Header.Content as='h1'>
              <Link to={`/${(content.namespace) ? content.namespace : content.category}/@${content._id}`} style={{color: '#ececec'}}>
                {content.title}
              </Link>
            </Header.Content>
          </Header>
        </Segment>
      )
    }
    return (
      <div>
        {rootTitle}
        <Segment secondary attached>
          <Grid>
            <Grid.Row verticalAlign='top'>
              <Grid.Column tablet={8} computer={8} mobile={8}>
                <Header size='medium'>
                  <AccountAvatar username={content.author} />
                  <AccountLink username={content.author} />
                  <Header.Subheader>
                    {'↳ '}
                    <TimeAgo date={`${content.created}Z`} />
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column tablet={8} computer={8} mobile={8} textAlign='right' verticalAlign='middle'>
                <Popup
                    trigger={(
                        <small>
                            <PlatformLink post={content} />
                        </small>
                    )}
                    hoverable
                    header='View this post on...'
                    content={(
                        <List>
                            <List.Item as='a' href={`https://steemit.com/${content.category}/@${content.author}/${content.permlink}`} target='_blank'>
                                steemit.com
                            </List.Item>
                            <List.Item as='a' href={`https://busy.org/${content.category}/@${content.author}/${content.permlink}`} target='_blank'>
                                busy.org
                            </List.Item>
                            <List.Item as='a' href={`https://steemd.com/${content.category}/@${content.author}/${content.permlink}`} target='_blank'>
                                steemd.com (explorer)
                            </List.Item>
                            <List.Item as='a' href={`https://steemdb.com/${content.category}/@${content.author}/${content.permlink}`} target='_blank'>
                                steemdb.com (explorer)
                            </List.Item>
                        </List>
                    )}
                    on={['hover']}
                />
                <PostVotes
                  target={content}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }
}
