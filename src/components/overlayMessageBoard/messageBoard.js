import './messageBoard.css'
function MessageBoard(props) {
    function handleMsBoard() {
        window.location.reload()
    }
    return (
        <div className='messageBoard'>
                <p>{props.message}<br />{props.txHash}<br />{props.error}</p>
                {props.clsBtnVis && <a onClick={handleMsBoard}>Close</a>}
        </div>
    )
}

export default MessageBoard