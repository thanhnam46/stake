import { useState } from 'react';
import './messageBoard.css';
function MessageBoard(props) {
    const [vis, setVis] = useState(true);
    function handleMsBoard() {
        setVis(false);
    }
    return (
        vis && (
            <div className="messageBoard">
                <p>
                    {props.message}
                    <br />
                    {props.txHash}
                    <br />
                    {props.error}
                </p>
                {props.clsBtnVis && <a onClick={handleMsBoard}>Close</a>}
            </div>
        )
    );
}

export default MessageBoard;
