import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const Home = ({ history }) => (
    <div className="home-container">
        <div className="home-title">Happy Birthday Edition</div>
        <div className="home-btn-start" onClick={() => {
            history.push("/game")
        }}>Start</div>
    </div>
)

export default Home