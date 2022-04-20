import { useState } from "react";
function poolAndWallet(Component, data) {
    const [account, setAccount] = useState('0x0000000000000000000000000000000000000000')

    return (
        <Component props={data} />
    )
}