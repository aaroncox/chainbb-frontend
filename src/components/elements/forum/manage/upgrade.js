import React from 'react';

import { Header, Segment } from 'semantic-ui-react'

import ForumUpgradeHistory from './upgrade/history'

export default class ForumUpgrade extends React.Component {
    render() {
        const { funding } = this.props.forum
        const history = (funding) ? funding.history : []
        return(
            <div>
                <Segment padded attached='top' secondary color='blue'>
                    <Header size='large'>
                        Funding History
                        <Header.Subheader>
                            Record of all accounts that have participated in funding this forum.
                        </Header.Subheader>
                    </Header>
                </Segment>
                <Segment attached='bottom'>
                    <Header>
                        Transaction History
                    </Header>
                    <ForumUpgradeHistory history={history} />
                </Segment>
            </div>
        );
    }
}
