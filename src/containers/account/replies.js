import React from 'react';
import { Helmet } from "react-helmet";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import { Button, Grid, Header, Icon, Segment } from 'semantic-ui-react'
import { goToTop } from 'react-scrollable-anchor'

import * as accountActions from '../../actions/accountActions'
import * as breadcrumbActions from '../../actions/breadcrumbActions'
import * as postActions from '../../actions/postActions'
import * as preferenceActions from '../../actions/preferenceActions'
import * as stateActions from '../../actions/stateActions'
import * as statusActions from '../../actions/statusActions'

import ForumPostReply from '../../components/elements/forum/post/reply'
import Paginator from '../../components/global/paginator'

class Replies extends React.Component {

  constructor(props) {
    super(props)
    const user = props.account.name || false
    let state = {
      loaded: false,
      page: 1,
      post: props.post,
      replies: [],
      totalReplies: 0,
      user: false
    }
    if(user) {
        state.user = user
        this.props.actions.fetchPostRepliesByAuthor(user);
    }
    this.state = state
    this.changePage = this.changePage.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const { post } = nextProps
    const user = nextProps.account.name || false
    if(user && nextProps.account && this.props.account.name !== user) {
      this.props.actions.fetchPostRepliesByAuthor(user);
      this.setState({user})
    }
    if(post.authors[user]) {
      const { replies, totalReplies } = post.authors[user]
      this.setState({ replies, totalReplies, loaded: true })
    }
  }
  changePage = (page) => {
    this.setState({
      page: page,
      replies: []
    })
    this.props.actions.fetchPostRepliesByAuthor(this.state.user, page);
    goToTop();
  }
  render() {
    const { totalReplies } = this.state
    const { account } = this.props
    let content = <Segment attached padded='very' loading style={{margin: '2em 0'}} />
    let { loaded, replies } = this.state
    if(replies && totalReplies > 0) {
      content = replies.map((topic, idx) => (
          <ForumPostReply
              account={this.props.account}
              actions={this.props.actions}
              key={idx}
              preferences={this.props.preferences}
              processing={this.props.processing}
              post={this.props.post}
              status={this.props.status}
              topic={topic}
          />
      ))
    }
    if(!totalReplies === 0 && loaded) {
        content = (
            <Segment attached textAlign='center' padded='very' style={{margin: '2em 0'}}>
                <Header as='h2' icon>
                    <Icon name='inbox' />
                    No posts found
                    <Header.Subheader>
                        There are no replies to any of your posts.
                    </Header.Subheader>
                </Header>
            </Segment>
        )
    }
    if(!account.isUser) {
        content = (
            <Segment attached textAlign='center' padded='very' style={{margin: '2em 0'}}>
                <Header as='h2' icon>
                    <Icon name='warning sign' />
                    You must be logged in.
                    <Header.Subheader>
                        This page loads the replies of the logged in account.
                    </Header.Subheader>
                </Header>
            </Segment>
        )
    }
    return (
      <div>
        <Helmet>
            <title>Inbox</title>
        </Helmet>
        <Segment stacked color='purple'>
          <Grid>
            <Grid.Row>
              <Grid.Column width={12}>
                <Header
                  icon='inbox'
                  color='purple'
                  size='huge'
                  content='Inbox'
                  subheader='The most recent replies to your posts.'
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Button
                basic
                color='purple'
                content='Refresh'
                icon='refresh'
                onClick={() => this.changePage(1)}
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <Paginator
                page={this.state.page}
                perPage={20}
                total={totalReplies}
                callback={this.changePage}
                />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {content}
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>

            </Grid.Column>
            <Grid.Column width={8}>
              <Paginator
                page={this.state.page}
                perPage={20}
                total={totalReplies}
                callback={this.changePage}
                />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    account: state.account,
    post: state.post,
    preferences: state.preferences,
    state: state.state,
    status: state.status
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({
    ...accountActions,
    ...breadcrumbActions,
    ...postActions,
    ...preferenceActions,
    ...stateActions,
    ...statusActions
  }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Replies);
