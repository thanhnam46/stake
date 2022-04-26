import React from "react"
import "./poolInfor.css"
import withWallet from "../HOC/hoc"

function PoolInfor(props) {
  props.onAccountChange()

  return (

    props.formVisibility && <div className="poolInfor">
      <ul>
        <li>
          Your staked balance{" "}
          <span className="boldText">{props.yourStakedBalance} NPO </span>
        </li>
        <li>
          Staking cap <span className="boldText">{props.stakingCap} NPO</span>{" "}
        </li>
        <li>
          Pool's total balance{" "}
          <span className="boldText">{props.stakedBalance} NPO</span>
        </li>
        <li>
          Maturity reward <span className="boldText">30% APR</span>
        </li>
        <li>
          Early rewards <span className="boldText">8% APR</span>{" "}
        </li>
        <li>
          Staking starts{" "}
          <span className="boldText">
            {new Date(props.stakingStart * 1000).toLocaleString()}
          </span>
        </li>
        <li>
          Contribution close in{" "}
          <span className="boldText">
            {new Date(props.stakingEnds * 1000).toLocaleString()}
          </span>
        </li>
        <li>
          Early withdraw open{" "}
          <span className="boldText">
            {new Date(props.earlyWithdraw * 1000).toLocaleString()}
          </span>
        </li>
        <li>
          Maturity at <span className="boldText">{props.maturityAt}</span>
        </li>
      </ul>
    </div>

  )
}
export default withWallet(PoolInfor)
