// authLogic.js
let supabaseClient = null;

export function setSupabase(client) {
    supabaseClient = client;
}

// 로그인 함수
export async function loginUser(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
}

// 포인트 조회 함수
export async function getUserPoints(userId) {
    const { data, error } = await supabaseClient
        .from('users') // 만드신 테이블 이름
        .select('point')
        .eq('user_id', userId) // 인증된 user의 ID와 매칭
        .single();
        
    if (error) return 0;
    return data.point;
}

// 포인트 업데이트 함수 (게임 종료 시 사용)
export async function updatePoints(userId, amountChange) {
    const currentPoints = await getUserPoints(userId);
    const { data, error } = await supabaseClient
        .from('users')
        .update({ point: currentPoints + amountChange })
        .eq('user_id', userId);
        
    return !error;
}
