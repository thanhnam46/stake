import './messageBoard.css'
function MessageBoard() {
    let message='this is a test message'
    return (
        <div className='messageBoard'>
            {message}
        </div>
    )
}

export default MessageBoard