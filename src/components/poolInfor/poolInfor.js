import './poolInfor.css'
import withWallet from '../HOC/hoc'

function PoolInfor(props) {
    props.connectMM()
    props.onAccountChange()

    let stakingCap = props.stakingCap
    let stakedBalance = props.stakedBalance
    let earlyWithdraw = props.earlyWithdraw
    let yourStakedBalance = props.yourStakedBalance
    let stakingStart = props.stakingStart
    let stakingEnds = props.stakingEnds
    let maturityAt = props.maturityAt

    return (
        <div className='poolInfor'>
            <ul>
                <li>Your staked balance <span className='boldText'>{yourStakedBalance} NPO </span></li>
                <li>Staking cap <span className='boldText'>{stakingCap} NPO</span> </li>
                <li>Pool balance <span className='boldText'>{stakedBalance} NPO</span></li>
                <li>Maturity reward <span className='boldText'>30% APR</span></li>
                <li>Early rewards <span className='boldText'>8% APR</span> </li>
                <li>Staking starts <span className='boldText'>{stakingStart}</span></li>
                <li>Contribution close <span className='boldText'>{stakingEnds}</span></li>
                <li>Early withdraw open <span className='boldText'>{earlyWithdraw}</span></li>
                <li>Maturity at <span className='boldText'>{maturityAt}</span></li>
            </ul>
        </div>
    )
}
export default withWallet(PoolInfor)