import withWallet from "../HOC/hoc"

function EventListener(props) {

    let stakingContract = props.stakingContract
    let option = {
        filter: {},
        fromBlock: 18639118,
    }

    option.filter.staker_ = props.account
    
    // Listen to Stake(Staked event)
    stakingContract.events.Staked(option, (err, event) => {
        if (err) {
            console.log(err)
        } else {
            console.log(event)
        }
    })

    // Listen to Unstake (PaidOut events)
    stakingContract.events.PaidOut(option, (err, event) => {
        if (err) {
            console.log(err)
        } else {
            console.log(event)
        }
    })

    return (
        <p>transaction List</p>
    )
}
export default withWallet(EventListener)