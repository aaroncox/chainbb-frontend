import React from 'react'
import { Button, Form, Header, Icon, Message, Modal } from 'semantic-ui-react'
import steem from 'steem'

export default class LoginModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      warningOpen: false,
      loginOpen: false,
      error: false,
      loading: false,
      account: '',
      key: ''
    }
  }

  handleOpen = (e) => this.setState({
    warningOpen: true,
    loginOpen: false
  })

  handleSwap = (e) => this.setState({
    warningOpen: false,
    loginOpen: true
  })

  handleClose = (e) => this.setState({
    warningOpen: false,
    loginOpen: false
  })

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = e => {
    e.preventDefault()
    const { account, key } = this.state,
          t = this
    let isValidKey = steem.auth.isWif(key),
        isValidForAccount = false
    // Indicate we're loading
    t.setState({
      loading: true,
      error: false
    })
    if(isValidKey) {
      steem.api.getAccounts([account], function(err, result) {
        if(!result.length) {
          t.setState({
            loading: false,
            error: 'Invalid account name'
          })
          return
        }
        if(result) {
          let public_key = steem.auth.wifToPublic(key),
              key_auths = result[0].posting.key_auths
          for(var i=0; i < key_auths.length; i++) {
            if(key_auths[i][0] === public_key) {
              isValidForAccount = true
            }
          }
        }
        if(isValidForAccount) {
          t.props.actions.signinAccount(account, key)
          t.handleClose()
        } else {
          t.setState({
            loading: false,
            error: 'Invalid WIF Key for Account'
          })
        }
      })
    } else {
      t.setState({
        loading: false,
        error: 'Invalid WIF Key'
      })
    }


  }

  render() {
    let {
      buttonColor,
      buttonFloated,
      buttonFluid,
      buttonIcon,
      buttonText,
    } = this.props
    let modal = (
      <Modal
        trigger={(
          <Button
            fluid={buttonFluid}
            color={buttonColor}
            floated={buttonFloated}
            content={buttonText || 'Sign-in'}
            icon={buttonIcon}
            onClick={this.handleOpen}
          />
        )}
        open={this.state.warningOpen}
        onOpen={this.open}
        onClose={this.close}
        basic
        size='small'
        className='modal-warning'
      >
        <Header icon='warning' content='Please use your keys responsibly.' />
        <Modal.Content>
          <h4>As with all Steem powered applications, please be aware of what website you're on and if you trust the organization running it. Make sure you are only using your posting key and your active/owner keys remain safe (preferrably in a wallet or offline).</h4>
        </Modal.Content>
        <Modal.Actions>
          <Button color='orange' onClick={this.handleClose}>Cancel</Button>
          <Button color='green' icon onClick={this.handleSwap}>Proceed <Icon name='right chevron' /></Button>
        </Modal.Actions>
      </Modal>
    )
    if(this.state.loginOpen) {
      modal = (
        <Modal
          open={this.state.loginOpen}
          size='small'
        >
          <Header icon='lock' content='Login using your account credentials' />
          <Modal.Content>
            <Message>
              <Message.Header>Before you login, please note:</Message.Header>
              <Message.List>
                <Message.Item>chainBB uses Steem&lsquo;s Post Beneficiaries feature at 5% of all posts. This reward is split between the users who operate the forums and the chainBB developers.</Message.Item>
                <Message.Item>You can login to chainBB using your Steem posting key (WIF format, starts with the number 5). These keys are currently stored unencrypted in your browser and used for posting and voting.</Message.Item>
                <Message.Item>chainBB is currently in <strong>BETA</strong> and may contain bugs.</Message.Item>
              </Message.List>
            </Message>
            <Form
              error={(this.state.error) ? true : false}
              loading={this.state.loading}>
              <Form.Input placeholder='Account Name' name='account' value={this.state.account} onChange={this.handleChange} />
              <Form.Input placeholder='Posting (Private Key)' type='password' name='key' value={this.state.key} onChange={this.handleChange} />
              <p>
                Need help finding your <strong>Posting (Private Key)</strong>?
                {' '}
                <a rel='nofollow' target='_blank' href='https://steemit.com/steemit-guides/@rgeddes/getting-your-posting-key---made-easy'>
                  Read this post by @rgeddes on steemit.com.
                </a>
              </p>
              <Message
                error
                header='Error'
                content={this.state.error}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='orange' onClick={this.handleClose}>Cancel</Button>
            <Button color='blue' icon onClick={this.handleSubmit}>Sign-in <Icon name='right chevron' /></Button>
          </Modal.Actions>
        </Modal>
      )
    }
    return modal
  }
}
