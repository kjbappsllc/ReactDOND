import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  getOpenedCases,
  getInfoText,
  getBankerPhase,
  getBankerOffer,
  getHighestOffer,
  getBankerRealOffer,
  getCurrentRound,
  getChosenReward,
  getGameOver
} from '../reducer';
import { Modal } from '../common-components';

Number.prototype.currency = function() {
  return `$${this.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

const SidePanelItem = ({ uuid, value, isOpened }) => (
  <div className={`panel-item ${isOpened ? 'opened' : ''}`}>
    {value.currency()}
  </div>
);

const CaseItem = ({ uuid, isOpened, isChosen, num, handleCaseClicked }) => (
  <div
    className={`case ${
      isOpened && !isChosen ? 'opened' : isChosen ? 'chosen' : 'unopened'
    }`}
    onClick={() => !isOpened && !isChosen && handleCaseClicked(uuid)}
  >
    <img src={require('../resources/images/briefcase.png')} />
    <div className="case-num">{num}</div>
  </div>
);

const Game = ({ dispatch, history, rewards, ...props }) => {
  const {
    openedCases,
    infoText,
    chosenID,
    bankerPhase,
    bankerOffer,
    highestOffer,
    realOffer,
    currentRound,
    gameEnd,
    chosenReward
  } = props;
  const mid = Math.floor(rewards.length / 2);
  const sortedRewards = _.sortBy(rewards, ['total']);
  const lastRound = currentRound === 10;
  const leftPanelItems = sortedRewards.slice(0, mid);
  const rightPanelItems = sortedRewards.slice(mid, sortedRewards.length);
  return (
    <div className="game-base">
      <div className="game-play-container">
        <div className="side-panel left">
          {leftPanelItems.map((reward, index) => (
            <SidePanelItem
              key={index}
              uuid={reward.uuid}
              value={reward.mask}
              isOpened={openedCases.includes(reward.uuid)}
            />
          ))}
        </div>
        <div className="gameplay-area">
          <div className="game-heading">
            <div className="game-heading-logo">
              <img
                style={{ width: '100%', objectFit: 'cover', height: 'auto' }}
                src={require('../resources/images/logo.png')}
              />
            </div>
          </div>
          <div className="case-container">
            {rewards.map((reward, index) => (
              <CaseItem
                key={index}
                uuid={reward.uuid}
                num={index + 1}
                isOpened={openedCases.includes(reward.uuid)}
                isChosen={chosenID === reward.uuid}
                handleCaseClicked={dispatch.handleCaseClicked}
              />
            ))}
          </div>
        </div>
        <div className="side-panel right">
          {rightPanelItems.map((reward, index) => (
            <SidePanelItem
              key={index}
              uuid={reward.uuid}
              value={reward.mask}
              isOpened={openedCases.includes(reward.uuid)}
            />
          ))}
        </div>
      </div>
      <div className="game-info-container">
        <div className="bottom-panel">
          <div className="chosen-case-container">
            <div className="label-text">Your Case</div>
            <div
              className={`case-container ${openedCases.includes(chosenID) &&
                'opened'}`}
              style={{ cursor: lastRound ? 'pointer' : 'default' }}
              onClick={() => lastRound && dispatch.handleCaseClicked(chosenID)}
            >
              <img
                style={{ width: '80%', height: 'auto' }}
                src={require('../resources/images/briefcase.png')}
              />
              {!chosenID ? (
                <img
                  className="inside-case"
                  src={require('../resources/images/questionmark.png')}
                />
              ) : (
                <div className="inside-case text">
                  {_.findIndex(rewards, { uuid: chosenID }) + 1}
                </div>
              )}
            </div>
          </div>
          <div className="vbar" />
          <div className="game-info-text">{infoText}</div>
        </div>
      </div>
      <Modal isOpen={bankerPhase}>
        <div className="bankerPhase-container">
          <div className="banker">
            <img src={require('../resources/images/banker.png')} />
          </div>
          <div className="banker-offer">
            {bankerOffer ? (
              <div className="offer">
                <div>BANKER'S OFFER: {bankerOffer.currency()}</div>
                <div className="hbar" />
                <div className="real-offer">{realOffer}</div>
                <div className="decision">
                  <div
                    className="action-l"
                    onClick={() => dispatch.handleAcceptBankerDeal(realOffer)}
                  >
                    Deal
                  </div>
                  <div
                    className="action-r"
                    onClick={() => dispatch.handleDeclineBankerDeal()}
                  >
                    No Deal
                  </div>
                </div>
                <div className="highest-offer">{`Highest Offer: ${highestOffer.currency()}`}</div>
              </div>
            ) : (
              <div className="calling-banker">BANKER IS CALLING ... </div>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={gameEnd}
        onOverlayClick={() => dispatch.handleAfterGameOver(history)}
      >
        <div className="rewards-container">
          <div className="title">Happy Birthday</div>
          <div className="subtitle">Your Gift:</div>
          <div className="hr" />
          <div className="content">{chosenReward}</div>
        </div>
      </Modal>
    </div>
  );
};

const mapStateToProps = state => ({
  rewards: state.game.rewards,
  openedCases: getOpenedCases(state),
  infoText: getInfoText(state),
  chosenID: state.game.chosenCaseId,
  bankerPhase: getBankerPhase(state),
  bankerOffer: getBankerOffer(state),
  highestOffer: getHighestOffer(state),
  realOffer: getBankerRealOffer(state),
  currentRound: getCurrentRound(state),
  chosenReward: getChosenReward(state),
  gameEnd: getGameOver(state)
});

const mapDispatchToProps = dispatch => ({
  dispatch: {
    handleCaseClicked: c => dispatch({ type: 'CASE_CLICKED', payload: c }),
    handleAcceptBankerDeal: o =>
      dispatch({ type: 'BANKER_OFFER_DECISION', payload: {type:'DEAL', offer: o }}),
    handleDeclineBankerDeal: () =>
      dispatch({ type: 'BANKER_OFFER_DECISION', payload: {type:'NO_DEAL', offer: '' }}),
    handleAfterGameOver: h => {
      h.goBack();
      dispatch({ type: 'GAME_RESET' });
    }
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
