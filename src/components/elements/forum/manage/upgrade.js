import React from 'react';

import { Divider, Grid, Header, Segment, Table } from 'semantic-ui-react'

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
