import React from 'react';

import { Grid, Header, List, Popup, Segment } from 'semantic-ui-react'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router-dom'
import PostVotes from '../../../../../containers/post/votes'
import PlatformLink from '../../../../../utils/link/platform'
import AccountAvatar from '../../../account/avatar'
import AccountLink from '../../../account/link'

export default class PostReplyHeader extends React.Component {
  render() {
    const { topic } = this.props
    const { parent, reply } = topic
    return (
        <Segment style={{ borderTop: '2px solid #2185D0' }} secondary attached stacked={(this.props.op && this.props.page !== 1)}>
          <Grid>
            <Grid.Row verticalAlign='top'>
              <Grid.Column tablet={13} computer={13} mobile={13}>
                <Header size='medium'>
                  <AccountAvatar username={reply.author} />
                  <AccountLink username={reply.author} />
                  <Header.Subheader>
                    {'↳ '}
                    <TimeAgo date={`${reply.created}Z`} />
                    {' • '}
                    <Link to={`${reply.url}`}>
                      {parent.root_title}
                    </Link>
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column tablet={3} computer={3} mobile={3} textAlign='right' verticalAlign='middle'>
                <Popup
                    trigger={(
                        <small>
                            <PlatformLink post={reply} />
                        </small>
                    )}
                    hoverable
                    header='View this post on...'
                    content={(
                        <List>
                            <List.Item as='a' href={`https://steemit.com/${reply.category}/@${reply.author}/${reply.permlink}`} target='_blank'>
                                steemit.com
                            </List.Item>
                            <List.Item as='a' href={`https://busy.org/${reply.category}/@${reply.author}/${reply.permlink}`} target='_blank'>
                                busy.org
                            </List.Item>
                            <List.Item as='a' href={`https://steemd.com/${reply.category}/@${reply.author}/${reply.permlink}`} target='_blank'>
                                steemd.com (explorer)
                            </List.Item>
                            <List.Item as='a' href={`https://steemdb.com/${reply.category}/@${reply.author}/${reply.permlink}`} target='_blank'>
                                steemdb.com (explorer)
                            </List.Item>
                        </List>
                    )}
                    on={['hover']}
                />
                <PostVotes
                  target={reply}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
    )
  }
}
