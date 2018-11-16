import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { getOpenedCases, getInfoText, getBankerPhase } from '../reducer'
import { Modal } from '../common-components'

const SidePanelItem = ({ uuid, value }) => (
    <div>{value}</div>
)

const CaseItem = ({ uuid, isOpened, isChosen, num, handleCaseClicked }) => (
    <div className={`case ${isOpened ? 'opened' : isChosen ? 'chosen' : 'unopened'}`} onClick={() => !isOpened && !isChosen && handleCaseClicked(uuid)}>
        <img src={require('../resources/images/briefcase.png')} />
        <div className="case-num">{num}</div>
    </div>
)

const Game = ({ dispatch, history, rewards, ...props }) => {
    const { openedCases, infoText, chosenID, bankerPhase } = props
    const mid = Math.floor(rewards.length / 2)
    const leftPanelItems = rewards.slice(0, mid)
    const rightPanelItems = rewards.slice(mid, rewards.length)

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
                                isOpened={openedCases.includes(reward.uuid)}
                                isChosen={chosenID === reward.uuid}
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
                        <div className="case-container">
                            <img style={{ width: '80%', height: 'auto' }} src={require('../resources/images/briefcase.png')} />
                            {!chosenID ?
                                <img className="inside-case" src={require('../resources/images/questionmark.png')} /> :
                                <div className="inside-case text">{_.findIndex(rewards, { uuid: chosenID }) + 1}</div>
                            }
                        </div>
                    </div>
                    <div className="vbar" />
                    <div className="game-info-container">{infoText}</div>
                </div>
            </div>
            <Modal isOpen={bankerPhase}>
                <div className="bankerPhase-container">
                    {bankerPhase.bankerOffer ?
                        <div>
                            <div>BANKER'S OFFER</div>
                            <div>
                                <div onClick={() => dispatch.handleAcceptBankerDeal()}>Deal</div>
                                <div onClick={() => dispatch.handleDeclineBankerDeal()}>No Deal</div>
                            </div>
                        </div>
                        : <div>BANKER IS CALLING ... </div>
                    }
                </div>
            </Modal>
        </div>
    )
}

const mapStateToProps = state => ({
    rewards: state.game.rewards,
    openedCases: getOpenedCases(state),
    infoText: getInfoText(state),
    chosenID: state.game.chosenCaseId,
    bankerPhase: getBankerPhase(state)
})

const mapDispatchToProps = dispatch => ({
    dispatch: {
        handleCaseClicked: c => dispatch({ type: 'CASE_CLICKED', payload: c }),
        handleAcceptBankerDeal: () => dispatch({ type: 'BANKER_OFFER_DECISION', payload: 'DEAL' }),
        handleDeclineBankerDeal: () => dispatch({ type: 'BANKER_OFFER_DECISION', payload: 'NO_DEAL' })
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Game)