import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const Home = ({ history }) => (
    <div className="flex">
        <h1 style={{ backgroundColor: 'white' }}>Home</h1>
        <button onClick={() => {
            history.push("/game")
        }}> This is a button </button>
    </div>
)

export default Home