import React from 'react';

import { Button, Container, Grid, Modal } from 'semantic-ui-react'

import PostContent from '../content'

export default class PostPreview extends React.Component {

  state = {
    post: {}
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      post: {
        content: {
          author: nextProps.author,
          title: nextProps.preview.title,
          body: nextProps.preview.body
        }
      }
    })
  }

  handleModal = (e) => {
    e.preventDefault()
    return false
  }

  render() {
    let display = null
    if(this.state.post.content) {
      display = (
        <Grid.Column mobile={16} tablet={12} computer={12}>
          <PostContent
            preview={true}
            content={this.state.post.content}
            { ...this.state } />
        </Grid.Column>
      )
    }

    return (
      <Modal
        closeIcon={true}
        size='large'
        trigger={
          <Button color='purple' onClick={this.handleModal}>
            Preview
          </Button>
        }>
        <Modal.Content>
          <Container>
            <Grid>
              <Grid.Row>
                <Grid.Column className='mobile hidden' width={4}>
                </Grid.Column>
                {display}
              </Grid.Row>
            </Grid>
          </Container>
        </Modal.Content>
      </Modal>
    )
  }

}
