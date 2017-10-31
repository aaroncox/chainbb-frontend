import React from 'react';

import { Divider, Grid, Header, Input, Message, Segment, Table } from 'semantic-ui-react'

import ForumUpgradeHistory from './upgrade/history'
import ForumUpgradeMeter from './upgrade/meter'

export default class ForumUpgrade extends React.Component {
    render() {
        const { forum, target } = this.props
        const { funding } = forum
        const { current, next, split } = target.progression
        const share = split / 100
        const history = (funding) ? funding.history : []
        return(
            <div>
                <Segment padded attached='top' secondary color='blue'>
                    <Header size='large'>
                        Forum Upgrades
                        <Header.Subheader>
                            Upgrades for each forum are unlocked organically as the forum grows in activity.
                        </Header.Subheader>
                    </Header>
                </Segment>
                <Segment attached padded>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Header>
                                    Progress
                                    <Header.Subheader>
                                        Current progress towards the next upgrade.
                                    </Header.Subheader>
                                </Header>
                                <Divider hidden />
                                <ForumUpgradeMeter target={target} columns={2} />
                            </Grid.Column>
                            <Grid.Column>
                                <Table definition size='small'>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Field</Table.HeaderCell>
                                            <Table.HeaderCell>Value</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>Current Beneficiaries</Table.Cell>
                                            <Table.Cell>{share}%</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Next Beneficiaries</Table.Cell>
                                            <Table.Cell>{share + 0.25}%</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Amount to Advance</Table.Cell>
                                            <Table.Cell>{next - current} STEEM</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Message
                        warning
                        title='This system is in development.'
                        content='The upgrades system is still in development and beneficiaries will not be displayed/counted yet. Once this is and beneficiaries are recording (about one week), that data will be accounted for here.'
                    />
                </Segment>
                <Segment padded secondary attached>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={10}>
                                <Header>
                                    How do forum upgrades work?
                                </Header>
                                <p style={{fontSize: '1.33em'}}>
                                    A chainBB forum organically upgrades based on the communities usage of it (via beneficiary rewards). As a forum's contribution increases, so does the percentage share of the rewards it generates. These upgrades can also be fast-tracked by it's users by manually funding the forum.
                                </p>
                                <p>
                                    This value increases and decreases over time and is currently for an unspecified timeframe. This value will be finalized within the first 30 days or so of it's launch, and is expected to be a timeframe somewhere between 30-90 days.
                                </p>
                            </Grid.Column>
                            <Grid.Column width={6} verticalAlign='bottom'>
                                <p>
                                    To contribute to the upgrades of this forum, complete the following transfer.
                                </p>
                                <Table definition verticalAlign='top'>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell collapsing textAlign='right'>From</Table.Cell>
                                            <Table.Cell>
                                                (any account)
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell collapsing textAlign='right'>To</Table.Cell>
                                            <Table.Cell>
                                                <a href='https://steemd.com/@chainbb'>
                                                    @chainbb
                                                </a>
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell collapsing textAlign='right'>Amount</Table.Cell>
                                            <Table.Cell>
                                                (any amount)
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell collapsing textAlign='right'>Memo</Table.Cell>
                                            <Table.Cell>
                                                <Input type='text' value={`ns:${target._id}`} />
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                                <p>
                                    <small>
                                        <strong>Notice</strong>: Failure to specify the memo exactly as above will cause the transfer to fail.
                                    </small>
                                </p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Segment attached='bottom'>
                    <Header>
                        Transaction History
                        <Header.Subheader>
                            Record of all funding and beneficiary events.
                        </Header.Subheader>
                    </Header>
                    <ForumUpgradeHistory history={history} />
                </Segment>
            </div>
        );
    }
}
