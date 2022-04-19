import './messageBoard.css'
function MessageBoard(props) {
    return (
        <div className='messageBoard'>
            {props.message}
        </div>
    )
}

export default MessageBoard