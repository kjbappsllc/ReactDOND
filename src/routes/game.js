import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const SidePanelItem = ({ uuid }) => (
    <div />
)

const Game = ({ history, rewards }) => {
    const mid = Math.floor(rewards.length / 2)
    const leftPanelItems = rewards.slice(0, mid)
    const rightPanelItems = rewards.slice(mid, rewards.length)
    return (
    <div className="game-base">
        <div className="game-play-container">
            <div className="side-panel">
                {
                    leftPanelItems.map((reward, index) => (
                        <SidePanelItem key={index} uuid={reward.uuid} />
                    ))
                }
            </div>
            <div className="flex gameplay-area">
                <div className="game-heading">
                    <div className="text game-heading-text">Title</div>
                </div>
            </div>
            <div className="side-panel">
                {
                    rightPanelItems.map((reward, index) => (
                        <SidePanelItem key={index} uuid={reward.uuid} />
                    ))
                }
            </div>
        </div>
        <div className="game-info-container">
            <div className="bottom-panel"></div>
        </div>
    </div>
    )
}

const mapStateToProps = state => ({
    rewards: state.game.rewards
})

export default connect(mapStateToProps, {})(Game)