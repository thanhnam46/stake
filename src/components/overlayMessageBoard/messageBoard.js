import './messageBoard.css'
function MessageBoard(props) {
    let message='this is a test message'
    return (
        <div className='messageBoard'>
            {props.message}
        </div>
    )
}

export default MessageBoard