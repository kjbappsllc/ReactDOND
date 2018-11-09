import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const Game = () => (
    <div className="game-base">
        <div className="flex gameplay-area">
            <div className="game-heading">
                <div className="text game-heading-text">Title</div>
            </div>
            <div className="side-panel left"></div>
            <div className="side-panel right"></div>
            <div className="bottom-panel"></div>
        </div>
    </div>
)

export default Game