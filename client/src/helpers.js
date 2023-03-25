export function abbreviateAddress(addr){
    addr = String(addr)
    return `${addr.slice(0,5)}...${addr.slice(-4)}`
}
