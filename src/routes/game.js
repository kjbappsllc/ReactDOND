import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { getUnopenedCases, getInfoText } from '../reducer'

const SidePanelItem = ({ uuid, value }) => (
    <div>{value}</div>
)

const CaseItem = ({ uuid, isOpened, num, handleCaseClicked }) => (
    <div className={`case ${isOpened ? 'opened' : 'unopened'}`} onClick={() => !isOpened && handleCaseClicked(uuid)}>
        <img src={require('../resources/images/briefcase.png')} />
        <div className="case-num">{num}</div>
    </div>
)

const Game = ({ dispatch, history, rewards, ...props }) => {
    const { unOpenedCases, infoText } = props
    const mid = Math.floor(rewards.length / 2)
    const leftPanelItems = rewards.slice(0, mid)
    const rightPanelItems = rewards.slice(mid, rewards.length)
    const unOpenedCaseIds = unOpenedCases.map((obj, ind) => obj.uuid)
    return (
        <div className="game-base">
            <div className="game-play-container">
                <div className="side-panel left">
                    {
                        leftPanelItems.map((reward, index) => (
                            <SidePanelItem key={index} uuid={reward.uuid} value={reward.total} />
                        ))
                    }
                </div>
                <div className="gameplay-area">
                    <div className="game-heading">
                        <div className="text game-heading-text">Title</div>
                    </div>
                    <div className="case-container">
                        {rewards.map((reward, index) => (
                            <CaseItem 
                              key={index} 
                              uuid={reward.uuid} 
                              num={index + 1} 
                              isOpened={!unOpenedCaseIds.includes(reward.uuid)}
                              handleCaseClicked={dispatch.handleCaseClicked} />
                        ))}
                    </div>
                </div>
                <div className="side-panel right">
                    {
                        rightPanelItems.map((reward, index) => (
                            <SidePanelItem key={index} uuid={reward.uuid} value={reward.total} />
                        ))
                    }
                </div>
            </div>
            <div className="game-info-container">
                <div className="bottom-panel">
                    <div className="chosen-case-container">
                        <div>Your Case</div>
                        <img style={{ width: '80%', height: 'auto' }} src={require('../resources/images/briefcase.png')} />
                    </div>
                    <div className="vbar" />
                    <div className="game-info-container">{infoText}</div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    rewards: state.game.rewards,
    unOpenedCases: getUnopenedCases(state),
    infoText: getInfoText(state)
})

const mapDispatchToProps = dispatch => ({
    dispatch: {
        handleCaseClicked: c => dispatch({ type: 'CASE_CLICKED', payload: c })
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Game)