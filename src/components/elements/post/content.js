import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Noty from 'noty';

import { Button, Divider, Header, Popup, Segment } from 'semantic-ui-react'

import MarkdownViewer from '../../../utils/MarkdownViewer';
import PostControls from './controls'

import PostForm from '../../../containers/post/form'
import PostFormHeader from './form/header'
import UserAvatar from '../account/avatar'
import AccountLink from '../account/link'
import PostTitle from './title'

export default class PostContent extends React.Component {

  handleResponding = (e) => {
    this.setState({
      responding: (this.state && this.state.responding) ? !this.state.responding : true,
    })
  }

  handleRespondingComplete = (e) => {
    new Noty({
      closeWith: ['click', 'button'],
      layout: 'topRight',
      progressBar: true,
      theme: 'semanticui',
      text: ReactDOMServer.renderToString(
        <Header>
          Your post has been submitted!
          <Header.Subheader>
            It may take a few moments to appear on chainBB.com, and will appear at the end of this thread.
          </Header.Subheader>
        </Header>
      ),
      type: 'success',
      timeout: 8000
    }).show();
    this.setState({
      responding: false
    })
  }

  handleEditing = () => {
    if(this.props.scrollToPost) {
      this.props.scrollToPost(this.props.content._id)
    }
    this.setState({
      editing: (this.state && this.state.editing) ? !this.state.editing : true,
    })
  }

  handleEditingComplete = (data) => {
    new Noty({
      closeWith: ['click', 'button'],
      layout: 'topRight',
      progressBar: true,
      theme: 'semanticui',
      text: ReactDOMServer.renderToString(
        <Header>
          Your post has been edited
          <Header.Subheader>
            It may take a few moments to update throughout chainBB.com.
          </Header.Subheader>
        </Header>
      ),
      type: 'success',
      timeout: 8000
    }).show();
    this.setState({
      editing: false,
      updatedPost: data.post
    })
  }

  render() {
    let post = this.props.content,
        postContent = false,
        postControls = false,
        postTitle = false,
        quote = this.props.quote,
        postFormHeader = (
          <PostFormHeader
            title='Leave a Reply'
            subtitle=''
            />
        ),
        editFormHeader = (
          <PostFormHeader
            title='Edit your Post'
            color='green'
            subtitle=''
            />
        ),
        responding = (this.state && this.state.responding) ? this.state.responding : false,
        editing = (this.state && this.state.editing) ? this.state.editing : false,
        editButton = false,
        editForm = false,
        postButton = (
          <Popup
            trigger={
              <Button floated='right'>
                <i className={"left quote icon"}></i>
                Reply
              </Button>
            }
            position='bottom center'
            inverted
            content='You must be logged in to post.'
            basic
          />
        ),
        postForm = false
    if (this.state && this.state.updatedPost) {
      const { updatedPost } = this.state;
      post.title = updatedPost.title;
      post.body = updatedPost.body;
      if (updatedPost.json_metadata && updatedPost.json_metadata.tags) {
        post.json_metadata.tags = updatedPost.json_metadata.tags;
      }
    }
    if(this.props.account && this.props.account.isUser) {
      postButton = (
        <Button
          onClick={this.handleResponding}
          color='green'
          icon='left quote'
          content='Reply'
          floated='right'
        />
      )
    }
    if(this.props.account && this.props.account.name === post.author) {
      editButton = (
        <Popup
          trigger={
            <Button
              basic
              onClick={this.handleEditing}
              color='grey'
              icon='pencil'
              floated='right'
            />
          }
          position='bottom center'
          inverted
          content='Edit your post'
          basic
        />
      )
    }
    if(responding) {
      postForm = (
        <Segment secondary color='green'>
          <PostForm
            action='create'
            actions={this.props.actions}
            formHeader={postFormHeader}
            elements={['body']}
            forum={this.props.post.forum}
            parent={post}
            onCancel={this.handleResponding}
            onComplete={this.handleRespondingComplete}
          />
        </Segment>
      )
    }
    if(editing) {
      editForm = (
        <Segment basic>
          <PostForm
            account={this.props.account}
            action='edit'
            actions={this.props.actions}
            formHeader={editFormHeader}
            elements={(post.depth === 0) ? ['title', 'body', 'tags'] : ['body']}
            existingPost={post}
            onCancel={this.handleEditing}
            onComplete={this.handleEditingComplete}
          />
        </Segment>
      )
    }
    if(!this.props.op || (this.props.op && this.props.page === 1) || this.props.preview) {
      postContent = (
        <Segment attached clearing className='thread-post'>
          {quote}
          <MarkdownViewer formId={'viewer'} text={post.body} jsonMetadata={{}} large highQualityPost={true}  />
          <Divider hidden></Divider>
        </Segment>
      )
      if (!this.props.preview) {
        postControls = (
          <PostControls
            target={post}
            editButton={editButton}
            postButton={postButton}
            { ...this.props }
            />
        )
        postTitle = (
          <PostTitle
              content={post}
              {...this.props}
          />
        )
      }
    }
    return (
      <div>
        {(editForm)
          ? (editForm)
          : (
            <div>
              {postTitle}
              {postContent}
              {postControls}
            </div>
          )
        }
        {postForm}
      </div>
    )
  }
}
