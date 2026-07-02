// gameLogic.js
export const calculateWin = (pred, winNum, type) => {
    if (type === 'number') return parseInt(pred) === winNum;
    const isOdd = (winNum % 2 !== 0);
    return (pred === 'odd' && isOdd) || (pred === 'even' && !isOdd);
};

export const syncPoint = async (supabase, amount, isWin, payoutFactor, lossFactor) => {
    const change = isWin ? (amount * payoutFactor) : -(amount * lossFactor);
    // Supabase 포인트 업데이트 로직
    await supabase.from('users').update({ point: ... }).eq('id', '...');
    return change;
};
