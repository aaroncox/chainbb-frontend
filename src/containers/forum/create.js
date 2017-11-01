import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { Divider, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

import * as accountActions from '../../actions/accountActions'
import * as forumActions from '../../actions/forumActions'
import * as statusActions from '../../actions/statusActions'
import * as preferenceActions from '../../actions/preferenceActions'

import ForumCreateButton from './create/button'

class ForumCreate extends React.Component {
    render() {
        return(
            <Segment color='blue'>
                <Segment textAlign='center' padded='very' basic>
                    <Header as='h1'>
                        Interested in starting your own forum?
                        <Header.Subheader>
                            This page will help guide you on creating your blockchain powered forum.
                        </Header.Subheader>
                    </Header>
                </Segment>
                <Divider />
                <Segment padded basic>
                    <Message
                        header='Notice - features/costs subject to change'
                        content='These forums are currently in beta and the information on this page is subject to change.'
                    />
                    <p style={{fontSize: '1.33em'}}>
                        Forums have a <strong>10 STEEM</strong> initial creation fee. No other fees are required after this. The hosting and upgrade costs of the forum are increased by the beneficary rewards generated though activity within the forum itself.
                    </p>
                    <p>
                        To get started, make sure you are logged into the account that will be the forum owner and make a reservation using the button below.
                    </p>
                    <ForumCreateButton />
                </Segment>
                <Divider />
                <Segment vertical style={{padding: '2em 0'}}>
                    <Grid verticalAlign='middle' padded='vertically' divided='vertically' container stackable>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Header size='large'>
                                    Features of a chainBB Forum
                                    <Header.Subheader>
                                        This beta launch set of features - just enough to get your community started.
                                    </Header.Subheader>
                                </Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Header size='large'>
                                    Blockchain Powered
                                    <Header.Subheader>
                                        All data exists on the Steem blockchain
                                    </Header.Subheader>
                                </Header>
                                <p style={{fontSize: '1.33em'}}>
                                    The chainBB forum engine is powered by the <a href='https://steem.io'>Steem</a> blockchain. This means your data is uncorruptable and forever permanant. Every post, vote, and action anyone takes within a chainBB forum happens on this blockchain. If the chainBB servers are ever corrupted, they can easily be rebuild by replaying the blockchain.
                                </p>
                            </Grid.Column>
                            <Grid.Column width={6} floated='right'>
                                <a href='https://steem.io'>
                                    <Image size='large' src='/images/create/steem.png' bordered />
                                </a>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Header size='large'>
                                    Dedicated Hosting
                                    <Header.Subheader>
                                        Hosting provided by chainBB.com
                                    </Header.Subheader>
                                </Header>
                                <p style={{fontSize: '1.33em'}}>
                                    Forums created on chainBB.com are indexed within the dedicated infrastructure tailored specifically for this purpose.  No need to setup your own server or run your own software.
                                </p>
                            </Grid.Column>
                            <Grid.Column width={6} floated='right'>
                                <Image size='large' src='/images/create/forum.png' bordered />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Header size='large'>
                                    Moderation
                                    <Header.Subheader>
                                        Tools to let you keep the forum free of spam and on-topic.
                                    </Header.Subheader>
                                </Header>
                                <p style={{fontSize: '1.33em'}}>
                                    All forums include a basic set of moderation tools that can be used by the forum owner to keep the forum on-topic and free of spam. Moderation activity is transparent and exists on the blockchain which can be reviewed by anyone.
                                </p>
                            </Grid.Column>
                            <Grid.Column width={6} floated='right'>
                                <Image size='large' src='/images/create/moderation.png' bordered />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Header size='large'>
                                    Beneficiary Rewards
                                    <Header.Subheader>
                                        Earn a portion of rewards from evert post created by users using the forum.
                                    </Header.Subheader>
                                </Header>
                                <p style={{fontSize: '1.33em'}}>
                                    Each chainBB forum also includes a portion of the beneficary rewards going to the creator of the forum, giving owners an incentive to build their community. This percentage starts at 1% and increases depdening on the performance of the forum.
                                </p>
                            </Grid.Column>
                            <Grid.Column width={6} floated='right' textAlign='center'>
                                <Image size='large' src='/images/create/rewards.png' bordered as={Link} to='/images/create/rewards.png' target='_blank' />
                                <small>
                                    * Percentages are subject to change while in beta
                                </small>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Segment>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        account: state.account,
        forum: state.forum,
        preferences: state.preferences,
        status: state.status
    }
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({
        ...accountActions,
        ...forumActions,
        ...preferenceActions,
        ...statusActions,
    }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(ForumCreate);
