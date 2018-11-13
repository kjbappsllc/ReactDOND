import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const Game = ({ history }) => (
    <div className="game-base">
        <div className="game-play-container">
            <div className="side-panel"></div>
            <div className="flex gameplay-area">
                <div className="game-heading">
                    <div className="text game-heading-text">Title</div>
                </div>
            </div>
            <div className="side-panel"></div>
        </div>
        <div className="game-info-container">
            <div className="bottom-panel"></div>
        </div>
    </div>
)

export default Game